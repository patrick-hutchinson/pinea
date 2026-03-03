import React from "react";
import { getVisits } from "@/lib/fetch";
import VisitsPage from "./VisitsPage";

export default async function Page({ params }) {
  const { slug } = await params; // ← IMPORTANT

  const visits = await getVisits();

  const visit = visits.find((p) => p.slug.current === slug);

  return <VisitsPage visits={visits} visit={visit} />;
}
