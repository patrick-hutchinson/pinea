import TitleBlock from "@/components/TitleBlock/TitleBlock";
import Link from "next/link";

const NewslettersPage = ({ newsletters }) => {
  return newsletters.map((newsletter) => (
    <Link href={`/newsletter/${newsletter.slug.current}`}>
      <TitleBlock key={newsletter.id} title={newsletter.title} />
    </Link>
  ));
};

export default NewslettersPage;
