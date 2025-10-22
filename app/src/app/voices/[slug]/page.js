import { getVoices } from "@/lib/fetch";
import VoicesPage from "./VoicePage";

export default async function Page({ params }) {
  const { slug } = params; // ✅ just destructure

  const voices = await getVoices();

  const voice = voices.find((p) => p.slug.current === slug);

  return <VoicesPage voices={voices} voice={voice} />;
}
