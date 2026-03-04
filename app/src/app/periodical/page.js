import { getPeriodicals, getPeriodicalPage, getSiteData } from "@/lib/fetch";

import PeriodicalPage from "./PeriodicalPage";

export default async function Page() {
  const periodicalPage = await getPeriodicalPage();
  const periodicals = await getPeriodicals();
  const site = await getSiteData();

  return <PeriodicalPage page={periodicalPage} periodicals={periodicals} site={site} />;
}
