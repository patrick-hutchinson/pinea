export type ListmonkRequest = (path: string, method?: string, body?: unknown) => Promise<any>;

export function createListmonkClient(): ListmonkRequest {
  const base = process.env.LISTMONK_URL;
  const user = process.env.LISTMONK_USER;
  const token = process.env.LISTMONK_TOKEN;
  if (!base || !user || !token) throw new Error('Listmonk Zugangsdaten fehlen auf dem App-Server.');
  if (new URL(base).protocol !== 'https:' && new URL(base).hostname !== 'localhost') throw new Error('Listmonk muss HTTPS verwenden.');
  return async (path, method = 'GET', body) => {
    const response = await fetch(`${base.replace(/\/$/, '')}/api${path}`, {
      method, headers: {Authorization: `Basic ${Buffer.from(`${user}:${token}`).toString('base64')}`, 'Content-Type': 'application/json'},
      ...(body ? {body: JSON.stringify(body)} : {}), cache: 'no-store', signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) {
      // Query strings contain recipient emails; only expose the operation and endpoint.
      const endpoint = path.split('?')[0];
      throw new Error(`Listmonk Anfrage fehlgeschlagen (HTTP ${response.status}; ${method} ${endpoint}).`);
    }
    const result = await response.json();
    if (result.data === undefined) throw new Error('Ungueltige Listmonk Antwort.');
    return result.data;
  };
}

async function findByName(request: ListmonkRequest, endpoint: string, name: string) {
  for (let page = 1; ; page++) {
    const data = await request(`${endpoint}?per_page=100&page=${page}`);
    const rows = Array.isArray(data) ? data : data.results;
    if (!Array.isArray(rows)) throw new Error('Ungueltige Listmonk Liste.');
    const match = rows.find((row) => row.name === name);
    if (match) return match;
    if (Array.isArray(data) || rows.length < 100) return null;
  }
}

export async function syncMembershipDraft(request: ListmonkRequest, mail: {
  stableName: string; listName: string; email: string; name: string; subject: string; html: string;
}) {
  const existing = await findByName(request, '/campaigns', mail.stableName);
  if (existing && existing.status !== 'draft') throw new Error('Diese Kampagne wurde bereits gestartet. Fuer einen neuen Versand bitte ein neues Dokument anlegen.');
  if (existing?.archive) throw new Error('Diese persoenliche Kampagne darf nicht oeffentlich archiviert werden.');
  const query = new URLSearchParams({query: `subscribers.email = '${mail.email.replaceAll("'", "''")}'`, per_page: '100'});
  const subscribers = await request(`/subscribers?${query}`);
  if (!Array.isArray(subscribers.results)) throw new Error('Ungueltige Listmonk Kontaktliste.');
  const matches = subscribers.results.filter((row) => row.email.toLowerCase() === mail.email);
  if (matches.length > 1) throw new Error('Mehrere Listmonk-Kontakte mit dieser E-Mail-Adresse gefunden.');
  let subscriber = matches[0];
  if (subscriber && subscriber.status !== 'enabled') throw new Error('Der Kontakt ist in Listmonk gesperrt oder deaktiviert.');

  let list = await findByName(request, '/lists', mail.listName);
  if (!list) list = await request('/lists', 'POST', {name: mail.listName, type: 'private', optin: 'single', tags: ['membership-rabattcodes']});
  if (!list?.id || list.type !== 'private') throw new Error('Die Membership-Empfaengerliste muss privat sein.');
  if (subscriber?.lists?.some((item) => item.id === list.id && item.subscription_status === 'unsubscribed')) {
    throw new Error('Der Kontakt hat sich von dieser Liste abgemeldet.');
  }
  if (!subscriber) subscriber = await request('/subscribers', 'POST', {
    email: mail.email, name: mail.name, status: 'enabled', lists: [],
  });
  if (!subscriber?.id) throw new Error('Listmonk Kontakt konnte nicht angelegt werden.');

  // Only this document's private list is changed; existing newsletter subscriptions stay intact.
  const members = await request(`/subscribers?list_id=${list.id}&per_page=all`);
  if (!Array.isArray(members.results)) throw new Error('Ungueltige Listmonk Empfaengerliste.');
  const otherIds = members.results.filter((row) => row.id !== subscriber.id).map((row) => row.id);
  if (otherIds.length) await request('/subscribers/lists', 'PUT', {ids: otherIds, action: 'remove', target_list_ids: [list.id]});
  await request('/subscribers/lists', 'PUT', {ids: [subscriber.id], action: 'add', target_list_ids: [list.id], status: 'confirmed'});
  const finalMembers = await request(`/subscribers?list_id=${list.id}&per_page=all`);
  if (finalMembers.results?.length !== 1 || finalMembers.results[0].id !== subscriber.id) throw new Error('Die Kampagne darf genau einen Empfaenger enthalten.');

  let template = await findByName(request, '/templates', 'P.IN.E.A Membership Einzelversand');
  if (!template) template = await request('/templates', 'POST', {
    name: 'P.IN.E.A Membership Einzelversand', type: 'campaign', body: '{{ template "content" . }}',
  });
  if (!template?.id || template.body !== '{{ template "content" . }}') throw new Error('Die Membership-Vorlage in Listmonk wurde veraendert. Bitte die reine Inhaltsvorlage wiederherstellen.');
  const payload = {name: mail.stableName, subject: mail.subject, lists: [list.id], type: 'regular',
    content_type: 'html', body: mail.html, template_id: template.id, tags: ['membership-rabattcodes']};
  const campaign = await request(existing ? `/campaigns/${existing.id}` : '/campaigns', existing ? 'PUT' : 'POST', payload);
  if (!campaign?.id || campaign.status !== 'draft') throw new Error('Listmonk hat keinen Kampagnen-Entwurf zurueckgegeben.');
  return {campaignId: campaign.id, listId: list.id};
}
