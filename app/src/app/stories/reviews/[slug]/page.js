// app/interviews/[slug]/page.tsx
import React from "react";
import { getReviews } from "@/lib/fetch";
import ReviewPage from "./ReviewPage";

export default async function Page({ params }) {
  const reviews = await getReviews();

  // In server components, params is a plain object
  const { slug } = await params; // ← IMPORTANT
  const review = reviews.find((p) => p.slug.current === slug);

  return <ReviewPage reviews={reviews} review={review} />;
}
