import { getVoices } from "@/lib/fetch";

import VoicesPage from "./VoicePage";

export default async function Page({ params }) {
  const { slug } = await params; // ✅ wait for params

  const [voices] = await Promise.all([getVoices()]);

  console.log(voices);

  const index = voices.findIndex((p) => p.slug.current === slug);
  const voice = voices[index];

  return <VoicesPage voice={voice} />;
}
