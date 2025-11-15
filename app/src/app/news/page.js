import { getOpenCalls } from "@/lib/fetch";

import NewsPage from "./NewsPage";

export default async function Page() {
  const openCalls = await getOpenCalls();

  return <NewsPage openCalls={openCalls} />;
}
