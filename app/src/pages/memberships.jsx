import MembersPage from "@/app/memberships/MembersPage";
import { getMembersPage, getMemberships, getSiteData } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Memberships({ global, memberships, page }) {
  return <MembersPage global={global} page={page} memberships={memberships} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const [page, memberships, global] = await Promise.all([getMembersPage(), getMemberships(), getSiteData()]);

  return {
    props: {
      global,
      memberships,
      page,
    },
  };
});
