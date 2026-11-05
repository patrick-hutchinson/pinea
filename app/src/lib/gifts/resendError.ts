const providerCodes = new Set([
  'validation_error', 'invalid_parameter', 'missing_required_field', 'missing_required_parameter',
  'invalid_idempotency_key', 'invalid_idempotent_request', 'concurrent_idempotent_requests',
  'invalid_attachment', 'missing_api_key', 'restricted_api_key', 'suspended_api_key',
  'invalid_permission', 'daily_quota_exceeded', 'monthly_quota_exceeded', 'rate_limit_exceeded',
  'application_error', 'service_unavailable', 'not_found', 'method_not_allowed',
]);

export class GiftEmailDeliveryError extends Error {
  httpStatus: number;
  providerCode: string;
  fields: string[];
  validationIssue: string;
  constructor(httpStatus: number, payload: unknown) {
    super(`Gift email request failed (${httpStatus})`);
    this.httpStatus = httpStatus;
    const data = payload && typeof payload === 'object' ? payload as Record<string, unknown> : {};
    this.providerCode = typeof data.name === 'string' && providerCodes.has(data.name) ? data.name : 'unknown';
    const message = typeof data.message === 'string' ? data.message : '';
    // Provider messages can echo email addresses or content. Return only fixed field names/hints.
    this.fields = [...new Set(message.match(/\b(?:from|to|subject|html|text|reply_to|bcc|cc|scheduled_at|idempotency_key)\b/g) || [])];
    this.validationIssue = /domain.*not verified|verify.*domain/i.test(message) ? 'sender_domain_not_verified'
      : /only send testing emails/i.test(message) ? 'test_recipient_restriction'
      : /invalid.*from|from.*(?:invalid|valid.*address)/i.test(message) ? 'invalid_sender_format'
      : /invalid.*(?:recipient|to.*field)|(?:recipient|to.*field).*invalid/i.test(message) ? 'invalid_recipient_format'
      : 'inspect_resend_request_log';
  }
}
