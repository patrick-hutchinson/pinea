import {randomUUID, timingSafeEqual} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {draftClient} from '@/lib/draftClient';
import {privateMembershipId, renderMembershipDiscount, type DiscountDocument} from '@/lib/membership-newsletter/render';
import {createListmonkClient, syncMembershipDraft} from '@/lib/membership-newsletter/listmonk';

export const runtime = 'nodejs';
export const maxDuration = 300;

export async function POST(request: Request) {
  const secret = process.env.MEMBERSHIP_NEWSLETTER_SYNC_SECRET;
  if (!secret || !process.env.SANITY_MIGRATE_TOKEN) return Response.json({error: 'Server configuration missing'}, {status: 503});
  const expected = Buffer.from(`Bearer ${secret}`);
  const received = Buffer.from(request.headers.get('authorization') || '');
  if (received.length !== expected.length || !timingSafeEqual(received, expected)) return Response.json({error: 'Unauthorized'}, {status: 401});
  let documentId: string;
  try { documentId = (await request.json()).documentId; }
  catch { return Response.json({error: 'Invalid JSON'}, {status: 400}); }
  if (typeof documentId !== 'string' || !privateMembershipId(documentId)) return Response.json({error: 'Invalid document ID'}, {status: 400});

  const client = draftClient.withConfig({useCdn: false, perspective: 'raw'});
  const leaseToken = randomUUID();
  let leased = false;
  let stage = 'prepare';
  try {
    const doc = await client.getDocument<DiscountDocument>(documentId);
    if (!doc || doc._type !== 'membershipDiscountNewsletter') return Response.json({error: 'Document not found'}, {status: 404});
    if (doc.syncLeaseUntil && Date.parse(doc.syncLeaseUntil) > Date.now()) return Response.json({error: 'Sync in progress'}, {status: 409});
    const template = await readFile(path.join(process.cwd(), 'src/app/scripts/send-codes', doc.language === 'en' ? 'mail.en.html' : 'mail.html'), 'utf8');
    const mail = renderMembershipDiscount(doc, template, process.env.MEMBERSHIP_REDEMPTION_BASE_URL || '', process.env.MEMBERSHIP_REDEMPTION_LINK_SECRET || '');
    const listmonk = createListmonkClient();
    stage = 'reserve';
    const reserved = await client.patch(documentId).ifRevisionId(doc._rev).set({
      syncStatus: 'processing', syncLeaseToken: leaseToken,
      syncLeaseUntil: new Date(Date.now() + 10 * 60_000).toISOString(),
    }).unset(['syncError']).commit();
    leased = true;
    stage = 'listmonk';
    const {campaignId} = await syncMembershipDraft(listmonk, mail);
    stage = 'save';
    await client.patch(documentId).ifRevisionId(reserved._rev).set({
      syncStatus: 'synced', syncFingerprint: mail.fingerprint, lastSyncedAt: new Date().toISOString(),
      listmonkCampaignUrl: `${process.env.LISTMONK_URL!.replace(/\/$/, '')}/campaigns/${campaignId}`,
      checkoutUrl: mail.checkoutUrl,
    }).unset(['syncError', 'syncLeaseToken', 'syncLeaseUntil']).commit();
    console.info('Membership newsletter draft synced', {documentId, campaignId});
    return Response.json({status: 'synced', campaignId});
  } catch (error) {
    if (stage === 'reserve') return Response.json({error: 'Document changed; retry sync'}, {status: 409});
    const message = stage === 'prepare' || stage === 'listmonk'
      ? (error instanceof Error ? error.message : 'Synchronisierung fehlgeschlagen.')
      : 'Dokument wurde waehrend der Synchronisierung geaendert. Bitte erneut synchronisieren.';
    console.error('Membership newsletter sync failed', {documentId, stage});
    try {
      const current = await client.getDocument<DiscountDocument>(documentId);
      if (current && (leased ? current.syncLeaseToken === leaseToken : !current.syncLeaseToken)) {
        await client.patch(documentId).ifRevisionId(current._rev).set({syncStatus: 'error', syncError: message})
          .unset(['syncLeaseToken', 'syncLeaseUntil']).commit();
      }
    } catch { console.error('Could not save membership sync status', {documentId}); }
    return Response.json({error: 'Sync failed; check Sanity status'}, {status: 500});
  }
}
