import TitleBlockExpand from "@/components/TitleBlock/TitleBlockExpand";

const NewsletterNews = ({ news }) => {
  return (
    <TitleBlockExpand
      openCall={news}
      title={translate(news.title)}
      text={translate(news.teaser)}
      label={<FormatDate date={news.deadline} format={{ month: "short", day: "numeric" }} />}
    />
  );
};

export default NewsletterNews;
