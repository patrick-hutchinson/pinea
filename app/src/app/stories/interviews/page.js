import { getInterviews } from "@/lib/fetch";
import InterviewsPage from "./InterviewsPage";

export default async function Page() {
  const interviews = await getInterviews();

  return <InterviewsPage interviews={interviews} />;
}
