import { getPeriodicals, getPeriodicalPage, getSiteData } from "@/lib/fetch";

import PrintPeriodicalPage from "./PrintPeriodicalPage";

export default async function Page({ searchParams }) {
  const resolvedSearchParams = (await searchParams) || {};
  const periodicalPage = await getPeriodicalPage();
  const periodicals = await getPeriodicals();
  const site = await getSiteData();
  const selector = typeof resolvedSearchParams?.selector === "string" ? resolvedSearchParams.selector : "";

  return <PrintPeriodicalPage page={periodicalPage} periodicals={periodicals} site={site} initialSelector={selector} />;
}
