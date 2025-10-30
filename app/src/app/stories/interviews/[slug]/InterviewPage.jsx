"use client";

import Text from "@/components/Text";
import Footnotes from "@/components/Footnotes/Footnotes";
import Interview from "@/components/Interview/Interview";

const InterviewPage = ({ interviews, interview }) => {
  const speakers = interview.speakers.map(({ initials, number }) => ({ initials, number }));

  return (
    <main>
      {interview.title}
      <Text text={interview.interview} />
      <Interview />
      <Footnotes text={interview.interview} />
    </main>
  );
};

export default InterviewPage;
