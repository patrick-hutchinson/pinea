import { withPagesShellProps } from "@/lib/pages/shellData";

export default function PagesHealth() {
  return <main style={{ minHeight: "100vh" }} />;
}

export const getServerSideProps = withPagesShellProps();
