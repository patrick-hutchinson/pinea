import {getMembershipSessionFromRequest} from '@/lib/auth/membershipSession';
import {isAuthEnabled} from '@/lib/runtimeFlags';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'private, no-store, max-age=0');
  res.setHeader('Vary', 'Cookie');
  if (!isAuthEnabled) return res.status(404).end();
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  const session = await getMembershipSessionFromRequest(req, res);
  if (!session?.email) return res.status(401).json({error: 'Sign in to inspect your own subscription status.'});
  // This endpoint is scoped to the authenticated customer. Never include token-cookie contents.
  const {debug, ...publicSession} = session;
  return res.status(200).json({session: publicSession, ...(req.query.debug === '1' ? {debug} : {})});
}
