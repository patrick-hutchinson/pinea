import { getSpotOns } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage/OverviewPage";

export default async function Page() {
  const spotOns = await getSpotOns();

  const data = [...spotOns];

  return <OverviewPage data={data} />;
}
