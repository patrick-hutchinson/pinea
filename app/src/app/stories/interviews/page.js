import { getInterviews } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage/OverviewPage";

export default async function Page() {
  const interviews = await getInterviews();

  const data = [...interviews];

  return <OverviewPage data={data} />;
}
