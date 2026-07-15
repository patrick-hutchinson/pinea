import NewsPage from "@/views/news/NewsPage";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import { getNewsWithAccess } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function News({ news }) {
  return <NewsPage news={news} />;
}

export const getServerSideProps = withPagesShellProps(async (context) => {
  const session = decodeSessionToken(context.req?.cookies?.[SESSION_COOKIE_NAME]);
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);
  const news = await getNewsWithAccess(canViewMembersOnlyContent);

  return {
    props: {
      news,
    },
  };
});
