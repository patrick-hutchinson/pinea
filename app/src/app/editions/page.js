import { getEditions } from "@/lib/fetch";

import EditionsPage from "./EditionsPage";

export default async function Page({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};

  const editions = await getEditions();
  const selector = typeof resolvedSearchParams?.selector === "string" ? resolvedSearchParams.selector : "";

  return <EditionsPage editions={editions} initialSelector={selector} />;
}
