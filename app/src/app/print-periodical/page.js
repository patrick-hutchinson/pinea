import { getPeriodicals, getPeriodicalPage, getSiteData } from "@/lib/fetch";

import PrintPeriodicalPage from "./PrintPeriodicalPage";

export default async function Page() {
  const periodicalPage = await getPeriodicalPage();
  const periodicals = await getPeriodicals();
  const site = await getSiteData();

  return <PrintPeriodicalPage page={periodicalPage} periodicals={periodicals} site={site} />;
}
