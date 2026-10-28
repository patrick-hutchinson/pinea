import OpenCallsPage from "@/views/open-calls/OpenCallsPage";
import { hasActiveMemberAccess } from "@/lib/auth/memberAccess";
import { getMembershipSessionFromRequest } from "@/lib/auth/membershipSession";
import { getOpenCallsWithAccess } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function OpenCalls({ openCalls }) {
  return <OpenCallsPage openCalls={openCalls} />;
}

export const getServerSideProps = withPagesShellProps(async (context) => {
  const session = await getMembershipSessionFromRequest(context.req);
  const canViewMembersOnlyContent = hasActiveMemberAccess(session);
  const openCalls = await getOpenCallsWithAccess(canViewMembersOnlyContent);

  return {
    props: {
      openCalls,
    },
  };
});
