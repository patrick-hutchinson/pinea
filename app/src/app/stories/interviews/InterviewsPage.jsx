"use client";

import Link from "next/link";
import { translate } from "@/helpers/translate";

const InterviewsPage = ({ interviews }) => {
  console.log(interviews);
  return interviews.map((interview, index) => {
    console.log(interview);
    return (
      <Link key={index} href={`/stories/interviews/${interview.slug.current}`}>
        {translate(interview.title)}
      </Link>
    );
  });
};

export default InterviewsPage;
