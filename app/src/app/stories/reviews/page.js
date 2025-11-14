import { getFeatures } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage";

export default async function Page() {
  const features = await getFeatures();

  const data = [...features];

  return <OverviewPage data={data} />;
}
