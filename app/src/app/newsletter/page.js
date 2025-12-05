import { getNewsletters } from "@/lib/fetch";

import NewslettersPage from "./NewslettersPage";

export default async function Page() {
  const newsletters = await getNewsletters();

  return <NewslettersPage newsletters={newsletters} />;
}
