import React from "react";
import { notFound } from "next/navigation";
import { getVisits } from "@/lib/fetch";
import VisitsPage from "./VisitsPage";

export default async function Page({ params }) {
  const { slug } = await params; // ← IMPORTANT

  const visits = await getVisits();

  const visit = visits.find((p) => p.slug.current === slug);
  if (!visit) notFound();

  return <VisitsPage visits={visits} visit={visit} />;
}
