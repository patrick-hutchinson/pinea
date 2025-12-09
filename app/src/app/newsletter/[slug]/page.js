import { getNewsletters } from "@/lib/fetch";
import { getSiteData } from "@/lib/fetch";

import NewsletterPage from "./NewsletterPage";

export default async function Page({ params }) {
  const { slug } = await params; // ← FIX

  const newsletters = await getNewsletters();
  const site = await getSiteData();

  const newsletter = newsletters.find((p) => p.slug.current === slug);

  return <NewsletterPage site={site} newsletters={newsletters} newsletter={newsletter} />;
}
