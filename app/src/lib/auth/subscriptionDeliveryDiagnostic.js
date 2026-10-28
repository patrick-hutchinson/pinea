const DELIVERY_OPTIONS_QUERY = `
  mutation CheckSubscriptionDeliveryAccess($subscriptionContractId: ID!) {
    subscriptionContractFetchDeliveryOptions(subscriptionContractId: $subscriptionContractId) {
      deliveryOptionsResult { __typename }
      userErrors { code }
    }
  }
`;

export async function checkSubscriptionDeliveryAccess({ apiUrl, accessToken, origin, contractId }) {
  if (!contractId) return { outcome: "skipped_no_active_contract" };

  try {
    // Omitting the optional address checks delivery options without saving a delivery method.
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: accessToken,
        Origin: origin,
        "User-Agent": "pinea-subscription-delivery-diagnostic",
      },
      body: JSON.stringify({ query: DELIVERY_OPTIONS_QUERY, variables: { subscriptionContractId: contractId } }),
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const payload = await response.json();
    const errors = payload?.errors || [];
    const codes = errors.map((error) => error?.extensions?.code || "UNKNOWN");

    if (!response.ok || errors.length) {
      return {
        outcome: response.status === 403 || codes.includes("ACCESS_DENIED") ? "access_denied" : "request_failed",
        httpStatus: response.status,
        errorCodes: codes,
      };
    }

    const result = payload?.data?.subscriptionContractFetchDeliveryOptions;
    if (!result) return { outcome: "missing_response" };
    if (result.userErrors?.length) {
      return { outcome: "delivery_validation_failed", errorCodes: result.userErrors.map((error) => error.code || "UNKNOWN") };
    }

    const resultType = result.deliveryOptionsResult?.__typename;
    if (!result.deliveryOptionsResult) return { outcome: "delivery_options_pending" };
    if (resultType === "SubscriptionDeliveryOptionsResultSuccess") return { outcome: "delivery_options_available" };
    if (resultType === "SubscriptionDeliveryOptionsResultFailure") return { outcome: "delivery_options_unavailable" };
    return { outcome: "unexpected_response" };
  } catch (error) {
    return { outcome: error?.name === "TimeoutError" ? "request_timed_out" : "request_failed" };
  }
}
