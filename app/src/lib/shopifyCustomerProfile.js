import { adminRequest } from "./shopifySubscriptions.js";

const addressFields = `id firstName lastName company address1 address2 city province provinceCode zip country countryCodeV2 phone`;
const profileQuery = `query ManagedCustomer($id: ID!, $after: String) {
  customer(id: $id) {
    id firstName lastName email phone productSubscriberStatus
    defaultAddress { id }
    addressesV2(first: 100, after: $after) {
      nodes { ${addressFields} }
      pageInfo { hasNextPage endCursor }
    }
  }
}`;

export class ProfileUpdateError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

const text = (value, max = 255) => {
  if (typeof value !== "string" || value.length > max) throw new ProfileUpdateError("Invalid field value.");
  return value.trim();
};

export async function getCustomerProfile(customerId) {
  if (!/^gid:\/\/shopify\/Customer\/\d+$/.test(customerId || "")) {
    throw new ProfileUpdateError("Please sign in again.", 401);
  }
  let after = null;
  let profile;
  const addresses = [];
  do {
    const data = await adminRequest(profileQuery, { id: customerId, after });
    const customer = data?.customer;
    if (!customer || customer.id !== customerId) throw new ProfileUpdateError("Could not load your Shopify profile.", 502);
    profile = customer;
    addresses.push(...(customer.addressesV2?.nodes || []));
    const page = customer.addressesV2?.pageInfo;
    after = page?.hasNextPage ? page.endCursor : null;
  } while (after);
  return {
    id: profile.id,
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    subscriberStatus: profile.productSubscriberStatus || "NEVER_SUBSCRIBED",
    defaultAddressId: profile.defaultAddress?.id || null,
    addresses,
  };
}

export async function updateCustomerProfile(customerId, payload) {
  if (!["details", "addressCreate", "addressUpdate", "addressDelete", "addressDefault"].includes(payload?.action)) {
    throw new ProfileUpdateError("Unknown profile action.");
  }
  const profile = await getCustomerProfile(customerId);
  let query, variables, field;

  if (payload?.action === "details") {
    field = "customerUpdate";
    const firstName = text(payload.firstName);
    const lastName = text(payload.lastName);
    if (!firstName || !lastName) throw new ProfileUpdateError("Please enter your first and last name.");
    variables = { input: { id: customerId, firstName, lastName, phone: text(payload.phone, 50) || null } };
    query = `mutation ManagedCustomerUpdate($input: CustomerInput!) {
      customerUpdate(input: $input) { customer { id } userErrors { field message } }
    }`;
  } else {
    const addressId = payload?.addressId;
    if (payload?.action !== "addressCreate" && !profile.addresses.some(address => address.id === addressId)) {
      throw new ProfileUpdateError("Address not found.", 404);
    }
    variables = { customerId, addressId };
    if (payload.action === "addressDelete") {
      field = "customerAddressDelete";
      query = `mutation ManagedAddressDelete($customerId: ID!, $addressId: ID!) {
        customerAddressDelete(customerId: $customerId, addressId: $addressId) { deletedAddressId userErrors { field message } }
      }`;
    } else if (payload.action === "addressDefault") {
      field = "customerUpdateDefaultAddress";
      query = `mutation ManagedAddressDefault($customerId: ID!, $addressId: ID!) {
        customerUpdateDefaultAddress(customerId: $customerId, addressId: $addressId) { customer { id } userErrors { field message } }
      }`;
    } else if (["addressCreate", "addressUpdate"].includes(payload.action)) {
      const input = payload.address || {};
      const address = Object.fromEntries(
        ["firstName", "lastName", "company", "address1", "address2", "city", "zip", "countryCode", "provinceCode", "phone"]
          .map(key => [key, text(input[key] ?? "")]),
      );
      if (!address.address1 || !address.city || !/^[A-Z]{2}$/.test(address.countryCode)) {
        throw new ProfileUpdateError("Please enter a street, city and country.");
      }
      if (payload.setAsDefault !== undefined && typeof payload.setAsDefault !== "boolean") {
        throw new ProfileUpdateError("Invalid default address selection.");
      }
      const create = payload.action === "addressCreate";
      field = create ? "customerAddressCreate" : "customerAddressUpdate";
      variables = { customerId, ...(!create ? { addressId } : {}), address, setAsDefault: payload.setAsDefault === true };
      query = `mutation ManagedAddressSave($customerId: ID!, ${create ? "" : "$addressId: ID!,"} $address: MailingAddressInput!, $setAsDefault: Boolean) {
        ${field}(customerId: $customerId, ${create ? "" : "addressId: $addressId,"} address: $address, setAsDefault: $setAsDefault) {
          address { id } userErrors { field message }
        }
      }`;
    } else {
      throw new ProfileUpdateError("Unknown profile action.");
    }
  }

  const data = await adminRequest(query, variables);
  if (!data?.[field]) throw new ProfileUpdateError("Shopify could not save your changes.", 502);
  const errors = data[field].userErrors || [];
  if (errors.length) throw new ProfileUpdateError(errors.map(error => error.message).join(" "));
  return getCustomerProfile(customerId);
}
