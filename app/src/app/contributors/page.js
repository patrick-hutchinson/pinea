import { getContributors } from "@/lib/fetch";
// import { localizeEvents } from "@/lib/i18n";
import ContributorsPage from "./ContributorsPage";

export default async function Page({ params }) {
  const contributors = await getContributors();

  return <ContributorsPage contributors={contributors} />;
}
