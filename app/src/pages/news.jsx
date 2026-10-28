import NewsPage from "@/views/news/NewsPage";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";
import { getMembershipSessionFromRequest } from "@/lib/auth/membershipSession";
import { getNewsWithAccess } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function News({ news }) {
  return <NewsPage news={news} />;
}

export const getServerSideProps = withPagesShellProps(async (context) => {
  const session = await getMembershipSessionFromRequest(context.req);
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);
  const news = await getNewsWithAccess(canViewMembersOnlyContent);

  return {
    props: {
      news,
    },
  };
});
