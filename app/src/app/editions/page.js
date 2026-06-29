import { getEditions, getEditionsPage } from "@/lib/fetch";

import EditionsPage from "./EditionsPage";

export default async function Page({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};

  const [editions, site] = await Promise.all([getEditions(), getEditionsPage()]);
  const selector = typeof resolvedSearchParams?.selector === "string" ? resolvedSearchParams.selector : "";

  return <EditionsPage editions={editions} site={site} initialSelector={selector} />;
}
