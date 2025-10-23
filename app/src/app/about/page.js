import { getAboutPage } from "@/lib/fetch";
import { getSiteData } from "@/lib/fetch";

import AboutPage from "./AboutPage";

export default async function Page() {
  const site = await getAboutPage();
  const global = await getSiteData();

  return <AboutPage global={global} site={site} />;
}
