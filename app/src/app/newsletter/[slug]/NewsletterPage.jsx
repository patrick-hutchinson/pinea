import NewsletterCover from "../components/NewsletterCover";

import styles from "../Newsletter.module.css";

import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterHeader from "../components/NewsletterHeader";

const NewsletterPage = ({ site, newsletter }) => {
  return (
    <div className={styles.main}>
      <div className={styles.container}>
        {/* <NewsletterHeader site={site} newsletter={newsletter} /> */}
        <NewsletterCover src={newsletter.cover.url} />
        <Longcopy className={styles.body} text={newsletter.text} />
      </div>
    </div>
  );
};

export default NewsletterPage;
