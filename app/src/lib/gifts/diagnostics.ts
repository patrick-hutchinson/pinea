export function giftFailureDetails(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  const missing = message.match(/^Missing ([A-Z][A-Z0-9_]*)$/);
  if (missing) return {reason: 'missing_environment_variable', variable: missing[1]};
  const http = message.match(/^(Gift email request failed|Shopify Admin request failed) \((\d{3})\)\.?$/);
  if (http) return {reason: http[1] === 'Gift email request failed' ? 'resend_request_failed' : 'shopify_admin_request_failed', httpStatus: Number(http[2])};
  if (/access denied/i.test(message)) {
    const fields = [...message.matchAll(/Access denied for ([A-Za-z_][A-Za-z0-9_]*) field/gi)].map((entry) => entry[1]);
    const scopes = [...new Set(message.match(/\b(?:read|write)_[a-z_]+\b/g) || [])];
    return {reason: 'shopify_access_denied', fields, requiredScopes: scopes};
  }
  const missingField = message.match(/Field ['"]([A-Za-z_][A-Za-z0-9_]*)['"] doesn't exist on type ['"]([A-Za-z_][A-Za-z0-9_]*)['"]/);
  if (missingField) return {reason: 'shopify_graphql_field_unavailable', field: missingField[1], type: missingField[2]};
  if (/not approved.*(?:Order|customer data)|protected customer data/i.test(message)) {
    return {reason: 'shopify_protected_customer_data_access_required'};
  }
  if (message.startsWith('Shopify token exchange failed:')) {
    const code = message.match(/\b(invalid_client|invalid_request|unauthorized_client|access_denied|invalid_grant)\b/)?.[1];
    return {reason: 'shopify_token_exchange_failed', ...(code ? {code} : {})};
  }
  const cause = error instanceof Error ? error.cause : null;
  if (cause && typeof cause === 'object' && 'code' in cause &&
      ['ENOTFOUND', 'ECONNRESET', 'ETIMEDOUT', 'UND_ERR_CONNECT_TIMEOUT'].includes(String(cause.code))) {
    return {reason: 'upstream_network_error', code: String(cause.code)};
  }
  if (error && typeof error === 'object' && 'code' in error && error.code === 'ENOENT') {
    return {reason: 'missing_runtime_file'};
  }
  const safeMessages = new Set([
    'Gift email template is missing a required placeholder', 'Missing Resend configuration',
    'Shopify Admin credentials unavailable', 'Gift order not accessible',
    'Gift order metafield write rejected', 'Gift discount creation rejected',
    'Invalid gift email', 'Invalid gift quantity', 'Invalid Shopify domain',
    'GIFT_CYCLES must be a positive billing-cycle count',
    'GIFT_VARIANT_ID and MEMBERSHIP_VARIANT_ID must be configured together',
  ]);
  return {reason: safeMessages.has(message) ? message : 'unexpected_processing_error'};
}
