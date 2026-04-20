import { getNewsWithAccess } from "@/lib/fetch";
import { getSessionFromCookies } from "@/lib/auth/session";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";

import NewsPage from "./NewsPage";

export const dynamic = "force-dynamic";

export default async function Page() {
  const session = await getSessionFromCookies();
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);
  const news = await getNewsWithAccess(canViewMembersOnlyContent);

  return <NewsPage news={news} />;
}
