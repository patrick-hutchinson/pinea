import { getPeriodicalPage } from "@/lib/fetch";

import PeriodicalPage from "./PeriodicalPage";

export default async function Page() {
  const periodicalPage = await getPeriodicalPage();

  return <PeriodicalPage page={periodicalPage} />;
}
