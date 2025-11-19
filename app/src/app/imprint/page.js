import { getSiteData } from "@/lib/fetch";

import ImprintPage from "./ImprintPage";

export default async function Page() {
  const site = await getSiteData();

  return <ImprintPage site={site} />;
}
