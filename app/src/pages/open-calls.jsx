import OpenCallsPage from "@/app/open-calls/OpenCallsPage";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";
import { decodeSessionToken, SESSION_COOKIE_NAME } from "@/lib/auth/sessionCore";
import { getOpenCallsWithAccess } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function OpenCalls({ openCalls }) {
  return <OpenCallsPage openCalls={openCalls} />;
}

export const getServerSideProps = withPagesShellProps(async (context) => {
  const session = decodeSessionToken(context.req?.cookies?.[SESSION_COOKIE_NAME]);
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);
  const openCalls = await getOpenCallsWithAccess(canViewMembersOnlyContent);

  return {
    props: {
      openCalls,
    },
  };
});
