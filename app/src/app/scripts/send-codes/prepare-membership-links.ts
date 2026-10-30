import fs from "node:fs";
import path from "node:path";

import { parse } from "csv-parse/sync";

type Recipient = { email: string; name: string; code: string };
type Customer = Record<string, string>;

const scriptDirectory = path.resolve(process.cwd(), "src/app/scripts/send-codes");
const recipientsPath = path.join(scriptDirectory, "member-discounts.csv");
const customerExportPath = process.env.CUSTOMER_EXPORT_PATH || "/Users/patrickhutchinson/Desktop/customers-56-with-metafields-DRAFT.csv";
const sellingPlanId = "gid://shopify/SellingPlan/690977046877";

const stringifyCsv = (rows: Record<string, string>[]) => {
  const columns = Object.keys(rows[0] || {});
  const escape = (value: string) => `"${value.replaceAll('"', '""')}"`;
  return `${columns.join(",")}\n${rows.map((row) => columns.map((column) => escape(row[column] || "")).join(",")).join("\n")}\n`;
};

const variants: Record<string, Record<string, string>> = {
  "P.I.N.E.A Member": {
    AT: "gid://shopify/ProductVariant/63963156873565",
    EU: "gid://shopify/ProductVariant/63971059597661",
    WORLD: "gid://shopify/ProductVariant/63971059630429",
  },
  "P.I.N.E.A Member Plus": {
    DEFAULT: "gid://shopify/ProductVariant/63963164475741",
  },
  "P.IN.E.A Member (Student)": {
    AT: "gid://shopify/ProductVariant/63971055567197",
    EU: "gid://shopify/ProductVariant/63971055599965",
  },
};

const regionFor = (customer: Customer) => {
  const noteRegion = customer.Note?.match(/Region:\s*([^;]+)/i)?.[1]?.trim().toUpperCase();
  if (noteRegion === "REST") return "WORLD";
  return noteRegion || customer["Default Address Country Code"]?.trim().toUpperCase() || "";
};

const rows = parse(fs.readFileSync(recipientsPath), {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  trim: true,
}) as Recipient[];
const customers = parse(fs.readFileSync(customerExportPath), {
  columns: true,
  skip_empty_lines: true,
  bom: true,
  trim: true,
}) as Customer[];
const customersByEmail = new Map(customers.map((customer) => [customer.Email.toLowerCase(), customer]));

const prepared = rows.map((recipient) => {
  const customer = customersByEmail.get(recipient.email.toLowerCase());
  const tier = customer?.["customer.metafields.custom.subscription_tier"] || "";
  const region = customer ? regionFor(customer) : "";
  const variantId = tier === "P.I.N.E.A Member Plus"
    ? variants[tier]?.DEFAULT || ""
    : variants[tier]?.[region] || "";

  return {
    email: recipient.email,
    name: recipient.name,
    code: recipient.code,
    tier,
    region,
    variant_id: variantId,
    selling_plan_id: variantId ? sellingPlanId : "",
  };
});

const unresolved = prepared.filter((recipient) => !recipient.variant_id);
fs.writeFileSync(recipientsPath, stringifyCsv(prepared));

console.log(`Prepared ${prepared.length - unresolved.length} membership checkout mappings.`);
if (unresolved.length > 0) {
  console.log(`Unresolved recipients (${unresolved.length}): ${unresolved.map((recipient) => recipient.name).join(", ")}`);
}
