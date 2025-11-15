import { getReviews } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage/OverviewPage";

export default async function Page() {
  const reviews = await getReviews();

  const data = [...reviews];

  return <OverviewPage data={data} />;
}
