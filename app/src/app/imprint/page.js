import { getImprint } from "@/lib/fetch";

import ImprintPage from "./ImprintPage";

export default async function Page() {
  const site = await getImprint();

  return <ImprintPage site={site} />;
}
