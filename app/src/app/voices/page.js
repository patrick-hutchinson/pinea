import { getVoices } from "@/lib/fetch";
import VoicesPage from "./VoicesPage";

export default async function Page() {
  const voices = await getVoices();

  return <VoicesPage voices={voices} />;
}
