import ImprintPage from "@/app/imprint/ImprintPage";
import { getImprint } from "@/lib/fetch";
import { withPagesShellProps } from "@/lib/pages/shellData";

export default function Imprint({ page }) {
  return <ImprintPage site={page} />;
}

export const getServerSideProps = withPagesShellProps(async () => {
  const page = await getImprint();

  return {
    props: {
      page,
    },
  };
});
