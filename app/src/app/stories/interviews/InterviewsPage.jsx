import Link from "next/link";

const InterviewsPage = ({ interviews }) => {
  console.log(interviews);
  return interviews.map((interview, index) => {
    console.log(interview);
    return (
      <Link key={index} href={`/interviews/${interview.slug.current}`}>
        {interview.title}
      </Link>
    );
  });
};

export default InterviewsPage;
