import NewsletterCover from "../components/NewsletterCover";

import styles from "../Newsletter.module.css";

import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterPage = ({ site, newsletter }) => {
  return (
    <div className={styles.main}>
      <div className={`container ${styles.container}`}>
        <NewsletterCover src={newsletter.cover.url} />
        <Longcopy className={styles.body} text={newsletter.text} />
      </div>
    </div>
  );
};

export default NewsletterPage;
