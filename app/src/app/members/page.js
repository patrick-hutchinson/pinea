import { getMemberships } from "@/lib/fetch";
import { getMembersPage } from "@/lib/fetch";

import MembersPage from "./MembersPage";

export default async function Page() {
  const memberships = await getMemberships();
  const site = await getMembersPage();

  return <MembersPage site={site} memberships={memberships} />;
}
