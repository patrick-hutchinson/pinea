export function giftFailureDetails(error: unknown) {
  const message = error instanceof Error ? error.message : '';
  const missing = message.match(/^Missing ([A-Z][A-Z0-9_]*)$/);
  if (missing) return {reason: 'missing_environment_variable', variable: missing[1]};
  const http = message.match(/^(Gift email request failed|Shopify Admin request failed) \((\d{3})\)\.?$/);
  if (http) return {reason: http[1] === 'Gift email request failed' ? 'resend_request_failed' : 'shopify_admin_request_failed', httpStatus: Number(http[2])};
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
