import { getOpenCalls } from "@/lib/fetch";

import OpenCallsPage from "./OpenCallsPage";

export default async function Page() {
  const openCalls = await getOpenCalls();

  return <OpenCallsPage openCalls={openCalls} />;
}
