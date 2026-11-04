import {readFile} from 'node:fs/promises';
import path from 'node:path';
import {parse} from 'csv-parse/sync';
import type {DiscountDocument} from './render.ts';

export async function resolveMembershipDates(doc: DiscountDocument): Promise<DiscountDocument> {
  const csv = await readFile(path.join(process.cwd(), 'src/app/scripts/send-codes/membership-start-dates.csv'), 'utf8');
  const rows: Record<string, string>[] = parse(csv, {columns: true, skip_empty_lines: true, bom: true});
  const matches = rows.filter((row) => row.email.trim().toLowerCase() === doc.recipientEmail.trim().toLowerCase());
  if (matches.length > 1) throw new Error('Mehrere Beginndaten fuer diese E-Mail-Adresse gefunden. Bitte Quelldaten pruefen.');
  const source = matches[0];
  return {...doc, membershipStartDate: doc.membershipStartDate || source?.membership_start_date || undefined,
    isFreeMembership: doc.isFreeMembership ?? (source?.is_free_membership === 'true')};
}
