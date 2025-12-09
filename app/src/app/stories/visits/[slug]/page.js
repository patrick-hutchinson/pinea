import React from "react";
import { getInterviews } from "@/lib/fetch";
import VisitsPage from "./VisitsPage";

export default async function Page({ params }) {
  const { slug } = await params; // ← IMPORTANT

  const interviews = await getInterviews();

  const interview = interviews.find((p) => p.slug.current === slug);

  return <VisitsPage interviews={interviews} interview={interview} />;
}
