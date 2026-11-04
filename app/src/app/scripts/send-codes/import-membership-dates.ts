import fs from 'node:fs';
import path from 'node:path';
import {parse} from 'csv-parse/sync';
import {membershipDates} from '../../../lib/membership-dates.ts';

const sourcePath = process.argv.find((arg) => arg.startsWith('--source='))?.slice(9);
if (!sourcePath) throw new Error('Supply --source=/path/to/extracted.json; use extract-membership-dates.py first.');
const source: Record<string, string>[] = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));
const directory = path.join(process.cwd(), 'src/app/scripts/send-codes');
const target = path.join(directory, 'member-discounts.csv');
const current: Record<string, string>[] = parse(fs.readFileSync(target), {columns: true, bom: true, skip_empty_lines: true});
const normalize = (email: string) => email.trim().toLowerCase();
const serialize = (rows: Record<string, string>[]) => {
  const columns = [...new Set(rows.flatMap((row) => Object.keys(row)))];
  const quote = (value: string) => `"${String(value || '').replaceAll('"', '""')}"`;
  return `${columns.join(',')}\n${rows.map((row) => columns.map((key) => quote(row[key])).join(',')).join('\n')}\n`;
};
const sourceByEmail = new Map<string, Record<string, string>[]>();
for (const row of source) {
  if (!row.email) continue;
  const key = normalize(row.email);
  sourceByEmail.set(key, [...(sourceByEmail.get(key) || []), row]);
}
const existingEmails = new Set(current.map((row) => normalize(row.email)));
const dateFields = (row: Record<string, string>) => {
  const dates = row.membership_start_date ? membershipDates(row.membership_start_date, row.is_free_membership === 'true') : null;
  return {membership_start_date: dates?.membershipStartDate || '',
    is_free_membership: row.is_free_membership || '', membership_term_days: dates ? String(dates.membershipTermDays) : '',
    renewal_date: dates?.renewalDate || '', source_row: row.source_row || ''};
};
const updated = current.map((row) => {
  const matches = sourceByEmail.get(normalize(row.email)) || [];
  if (matches.length === 0 && row.date_match_status === 'manual_confirmed' && row.membership_start_date) {
    return {...row, ...dateFields(row)};
  }
  const found = matches.length === 1 ? matches[0] : null;
  return {...row, ...dateFields(found || {}), date_match_status: matches.length > 1 ? 'duplicate_source_email'
    : !found ? 'no_source_match' : !found.membership_start_date ? 'missing_start_date' : 'matched',
    billing_alignment_confirmed: row.billing_alignment_confirmed || 'false'};
});
const sourceRows = source.map((row) => ({...row, ...dateFields(row), existing_code_recipient: existingEmails.has(normalize(row.email)) ? 'true' : 'false',
  review_status: !row.email ? 'missing_email' : (sourceByEmail.get(normalize(row.email))?.length || 0) > 1 ? 'duplicate_source_email'
    : !row.membership_start_date ? 'missing_start_date' : existingEmails.has(normalize(row.email)) ? 'matched' : 'not_in_code_table'}));
console.log(JSON.stringify({existingRecipients: updated.length, matched: updated.filter((row) => row.date_match_status === 'matched').length,
  sourceMembers: sourceRows.length, freeMemberships: sourceRows.filter((row) => row.is_free_membership === 'true').length,
  missingStartDates: sourceRows.filter((row) => !row.membership_start_date).length,
  sourceOnly: sourceRows.filter((row) => row.existing_code_recipient === 'false').length,
  unmatchedCodeTableRows: updated.map((row, i) => ({row: i + 2, status: row.date_match_status})).filter((row) => row.status !== 'matched')}, null, 2));
if (process.argv.includes('--write')) {
  fs.writeFileSync(target, serialize(updated));
  fs.writeFileSync(path.join(directory, 'membership-start-dates.csv'), serialize(sourceRows));
  console.log('Updated local CSV tables only. No Shopify, Sanity, Listmonk or email changes were made.');
} else console.log('Dry run only; pass --write to update local CSV tables.');
