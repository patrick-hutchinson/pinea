import React from "react";
import { getInterviews } from "@/lib/fetch";
import VisitsPage from "./VisitsPage";

export default async function Page({ params }) {
  const interviews = await getInterviews();

  // In server components, params is a plain object
  const slug = params.slug;
  const interview = interviews.find((p) => p.slug.current === slug);

  return <VisitsPage interviews={interviews} interview={interview} />;
}
