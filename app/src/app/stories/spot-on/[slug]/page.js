// app/interviews/[slug]/page.tsx
import React from "react";
import { getSpotOns } from "@/lib/fetch";
import SpotOnPage from "./SpotOnPage";

export default async function Page({ params }) {
  const spotOns = await getSpotOns();

  // In server components, params is a plain object
  const slug = params.slug;
  const spotOn = spotOns.find((p) => p.slug.current === slug);

  return <SpotOnPage spotOns={spotOns} spotOn={spotOn} />;
}
