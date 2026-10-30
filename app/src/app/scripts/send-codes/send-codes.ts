import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";
import { Resend } from "resend";

import { createMembershipRedemptionLink } from "../../../lib/membership-redemption";

type Recipient = {
  email: string;
  name: string;
  code: string;
  variant_id?: string;
  selling_plan_id?: string;
};

// Run the compiled script from the app directory; this keeps the source CSV
// and template paths stable even when TypeScript emits JavaScript elsewhere.
const scriptDirectory = path.resolve(process.cwd(), "src/app/scripts/send-codes");
const recipientsPath = path.join(scriptDirectory, "member-discounts.csv");
const templatePath = path.join(scriptDirectory, "mail.html");
const shouldSend = process.argv.includes("--send") && process.argv.includes("--confirm-send-codes");
const testRecipientEmail = process.argv.find((argument) => argument.startsWith("--send-test="))?.slice("--send-test=".length);
const dryRunTestRecipientEmail = process.argv
  .find((argument) => argument.startsWith("--dry-run-test="))
  ?.slice("--dry-run-test=".length);
const shouldSendTest = Boolean(testRecipientEmail) && process.argv.includes("--confirm-test-email");
const shouldDryRunTest = Boolean(dryRunTestRecipientEmail);

const requiredColumns = ["email", "name", "code"];
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const loadRecipients = ({ allowDuplicateRows = false } = {}): Recipient[] => {
  const rows = parse(fs.readFileSync(recipientsPath), {
    columns: true,
    skip_empty_lines: true,
    bom: true,
    trim: true,
  }) as Recipient[];

  if (rows.length === 0) throw new Error("The recipient CSV has no rows.");

  const missingColumns = requiredColumns.filter((column) => !Object.hasOwn(rows[0], column));
  if (missingColumns.length > 0) {
    throw new Error(`The recipient CSV is missing required columns: ${missingColumns.join(", ")}.`);
  }

  const invalidRows = rows.filter((row) => !emailPattern.test(row.email || "") || !row.name?.trim() || !row.code?.trim());
  if (invalidRows.length > 0) {
    throw new Error(`The recipient CSV contains ${invalidRows.length} incomplete or invalid row(s).`);
  }

  const duplicateEmails = rows.length - new Set(rows.map((row) => row.email.toLowerCase())).size;
  const duplicateCodes = rows.length - new Set(rows.map((row) => row.code)).size;
  if (!allowDuplicateRows && (duplicateEmails > 0 || duplicateCodes > 0)) {
    throw new Error(`The recipient CSV has ${duplicateEmails} duplicate email(s) and ${duplicateCodes} duplicate code(s).`);
  }

  return rows;
};

const getCheckoutUrl = (recipient: Recipient) => {
  const baseUrl = process.env.MEMBERSHIP_REDEMPTION_BASE_URL;
  const secret = process.env.MEMBERSHIP_REDEMPTION_LINK_SECRET;
  if (!baseUrl || !secret) {
    throw new Error("MEMBERSHIP_REDEMPTION_BASE_URL and MEMBERSHIP_REDEMPTION_LINK_SECRET must be set before rendering checkout links.");
  }
  if (!recipient.variant_id || !recipient.selling_plan_id) {
    throw new Error(`Missing membership checkout mapping for ${recipient.name}.`);
  }

  return createMembershipRedemptionLink(baseUrl, {
    code: recipient.code,
    variantId: recipient.variant_id,
    sellingPlanId: recipient.selling_plan_id,
  }, secret);
};

const render = (template: string, recipient: Recipient, checkoutUrl: string) => {
  const rendered = template
    .replaceAll("{{name}}", recipient.name)
    .replaceAll("{{code}}", recipient.code)
    .replaceAll("{{checkoutUrl}}", checkoutUrl);

  if (/\{\{(?:name|code|checkoutUrl)\}\}/.test(rendered)) {
    throw new Error("The rendered email still contains an unresolved recipient placeholder.");
  }

  return rendered;
};

const getTestRecipient = (recipients: Recipient[], email: string) => {
  const testRecipients = recipients.filter((row) => row.email.toLowerCase() === email.toLowerCase());
  if (testRecipients.length === 0) {
    throw new Error(`No recipient with the email ${email} exists in member-discounts.csv.`);
  }
  if (testRecipients.length > 1) {
    throw new Error(`The test recipient ${email} appears more than once in member-discounts.csv.`);
  }

  return testRecipients[0];
};

const getSendConfiguration = () => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const replyTo = process.env.RESEND_REPLY_TO;
  const subject = process.env.RESEND_SUBJECT || "Dein Membership-Code";

  if (!apiKey || !from || !replyTo) {
    throw new Error("RESEND_API_KEY, RESEND_FROM, and RESEND_REPLY_TO must be set before sending.");
  }

  return { apiKey, from, replyTo, subject };
};

const main = async () => {
  const template = fs.readFileSync(templatePath, "utf8");
  // Test delivery validates every row's required fields, but only needs its
  // one selected address to be unique. The full batch stays blocked by any
  // duplicate elsewhere in the CSV.
  const recipients = loadRecipients({ allowDuplicateRows: shouldSendTest || shouldDryRunTest });

  if (!template.includes("{{code}}") || !template.includes("{{checkoutUrl}}")) {
    throw new Error("mail.html must contain both {{code}} and {{checkoutUrl}} before sending.");
  }

  if (shouldDryRunTest) {
    if (shouldSend || shouldSendTest) {
      throw new Error("Choose either a dry run, a test send, or the member batch.");
    }

    if (!dryRunTestRecipientEmail) throw new Error("Missing test-recipient email.");
    const recipient = getTestRecipient(recipients, dryRunTestRecipientEmail);
    const renderedTemplate = render(template, recipient, getCheckoutUrl(recipient));
    if (renderedTemplate.includes("{{code}}") || renderedTemplate.includes("{{checkoutUrl}}")) {
      throw new Error("The test template did not replace all recipient placeholders.");
    }

    console.log(`Test dry run passed for ${recipient.email}.`);
    console.log("The matching recipient, code, signed checkout link, and rendered template were validated. No email was sent.");
    return;
  }

  if (!shouldSend && !shouldSendTest) {
    console.log(`Validation passed: ${recipients.length} recipients and unique codes are ready.`);
    console.log("No email was sent. A test requires --send-test=<email> and --confirm-test-email.");
    console.log("The member batch requires --send and --confirm-send-codes.");
    return;
  }

  if (shouldSend && shouldSendTest) {
    throw new Error("Choose either the test send or the member batch, not both.");
  }

  const { apiKey, from, replyTo, subject } = getSendConfiguration();
  const resend = new Resend(apiKey);

  if (shouldSendTest) {
    if (!testRecipientEmail) throw new Error("Missing test-recipient email.");
    const recipient = getTestRecipient(recipients, testRecipientEmail);

    const { error } = await resend.emails.send({
      from,
      replyTo,
      to: recipient.email,
      subject: `[TEST] ${subject}`,
      html: render(template, recipient, getCheckoutUrl(recipient)),
      headers: { "Idempotency-Key": `member-codes-test-${recipient.code}` },
    });

    if (error) throw new Error(`Resend rejected the test email: ${error.message}`);

    console.log(`Sent one test email to ${recipient.email}. No other recipients were contacted.`);
    return;
  }

  // Resend batch requests support at most 100 messages.
  for (let index = 0; index < recipients.length; index += 100) {
    const chunk = recipients.slice(index, index + 100);
    const emails = chunk.map((recipient) => ({
      from,
      replyTo,
      to: recipient.email,
      subject,
      html: render(template, recipient, getCheckoutUrl(recipient)),
    }));

    const { error } = await resend.batch.send(emails, {
      headers: { "Idempotency-Key": `member-codes-${index}` },
    });

    if (error) throw new Error(`Resend rejected batch ${index}: ${error.message}`);

    console.log(`Sent batch ${index / 100 + 1} with ${emails.length} message(s).`);
  }
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
