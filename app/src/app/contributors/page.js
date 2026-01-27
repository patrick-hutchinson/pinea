import { getContributors } from "@/lib/fetch";
import ContributorsPage from "./ContributorsPage";

export default async function Page({ params }) {
  const contributors = await getContributors();

  return <ContributorsPage contributors={contributors} />;
}
