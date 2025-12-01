// app/interviews/[slug]/page.tsx
import React from "react";
import { getSpotOnDrafts } from "@/lib/fetch";
import SpotOnDraft from "./SpotOnDraft";

export default async function Page({ params }) {
  const spotOns = await getSpotOnDrafts();

  // In server components, params is a plain object
  const slug = params.slug;
  const spotOn = spotOns.find((p) => p.slug.current === slug);

  return <SpotOnDraft stories={spotOns} story={spotOn} />;
}
