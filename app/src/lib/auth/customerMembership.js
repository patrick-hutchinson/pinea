import {customerTokensFromResponse} from './customerTokens.js';
import {fetchCustomerSubscriptionStatus, getShopifyAuthConfig, refreshCustomerAccessToken, unavailableCustomerMembership} from './shopifyCustomerAuth.js';

export async function resolveCustomerMembership({session, credentials, origin, onTokensUpdated}) {
  // Whitelist identity fields: old cookie membership snapshots are never authoritative.
  const identity = {sub: session?.sub || null, email: session?.email || null, name: session?.name || '',
    shopifyCustomerId: session?.shopifyCustomerId || null};
  if (!identity.email) return {...identity, ...unavailableCustomerMembership('not_authenticated'), isAuthenticated: false};
  const unavailable = (reason, details = {}, needsReauthentication = false) => ({...identity,
    ...unavailableCustomerMembership(reason, details), isAuthenticated: true, needsReauthentication});
  if (!credentials || credentials.customerId !== identity.shopifyCustomerId) return unavailable('customer_reauthentication_required', {}, true);
  let config;
  try { config = getShopifyAuthConfig({url: origin}); }
  catch { return unavailable('customer_account_configuration_missing'); }
  if (credentials.clientId !== config.clientId) return unavailable('customer_account_client_changed', {}, true);
  let current = credentials;
  const refresh = async () => {
    if (!current.refreshToken || !onTokensUpdated) throw new Error('Reauthentication required');
    const response = await refreshCustomerAccessToken({...config, refreshToken: current.refreshToken});
    current = customerTokensFromResponse(response, identity.shopifyCustomerId, config.clientId, current);
    await onTokensUpdated(current);
  };
  try {
    if (current.expiresAt <= Date.now() + 30_000) await refresh();
    let status = await fetchCustomerSubscriptionStatus({apiUrl: config.apiUrl, accessToken: current.accessToken,
      origin, expectedCustomerId: identity.shopifyCustomerId, grantedScopes: current.scopes});
    if (status.debug?.httpStatus === 401 && current.refreshToken) {
      await refresh();
      status = await fetchCustomerSubscriptionStatus({apiUrl: config.apiUrl, accessToken: current.accessToken,
        origin, expectedCustomerId: identity.shopifyCustomerId, grantedScopes: current.scopes});
    }
    return {...identity, ...status, isAuthenticated: true, needsReauthentication: status.debug?.httpStatus === 401};
  } catch {
    return unavailable('customer_token_refresh_failed', {hasRefreshToken: Boolean(current.refreshToken)}, true);
  }
}
