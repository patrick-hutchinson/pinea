import { getSpotOns } from "@/lib/fetch";
import { notFound } from "next/navigation";
import SpotOnPage from "./SpotOnPage";

export default async function Page({ params }) {
  const spotOns = await getSpotOns();

  // In server components, params is a plain object
  const { slug } = await params;
  const spotOn = spotOns.find((p) => p.slug.current === slug);
  if (!spotOn) notFound();

  return <SpotOnPage spotOns={spotOns} spotOn={spotOn} />;
}
