import { getPeople } from "@/lib/fetch";
import OverviewPage from "@/pages/OverviewPage";

export default async function Page() {
  const people = await getPeople();

  const data = [...people];

  return <OverviewPage data={data} />;
}
