import NewsletterRunningText from "../components/NewsletterRunningText";
import Showcase from "../components/Showcase";
import NewsletterBulletin from "../components/NewsletterBulletin";
import NewsletterAnnouncements from "../components/NewsletterAnnouncements";
import NewsletterDoubleFeature from "../components/NewsletterDoubleFeature";
import NewsletterAdBanner from "../components/NewsletterAdBanner";

export const renderNewsletter = (block, language) => {
  if (!block) return null;

  const type = block._type;

  switch (type) {
    case "newsletterRunningText":
      return <NewsletterRunningText block={block} />;
    case "newsletterShowcase":
      return <Showcase block={block} />;
    case "newsletterBulletins":
      return <NewsletterBulletin block={block} language={language} />;
    case "newsletterAnnouncements":
      return <NewsletterAnnouncements block={block} />;
    case "newsletterDoubleFeature":
      return <NewsletterDoubleFeature block={block} language={language} />;
    case "newsletterAdBanner":
      return <NewsletterAdBanner block={block} />;
  }
};
