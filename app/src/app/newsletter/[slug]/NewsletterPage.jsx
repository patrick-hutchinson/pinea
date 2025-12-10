import NewsletterCover from "../components/NewsletterCover";

import styles from "../Newsletter.module.css";

import Longcopy from "@/components/Longcopy/Longcopy";

const NewsletterPage = ({ site, newsletter }) => {
  return (
    <div className={styles.main}>
      <div className={`container ${styles.container}`} style={{ paddingBottom: "300px" }}>
        <NewsletterCover src={newsletter.cover.url} />
        <Longcopy className={styles.body} text={newsletter.text} style={{ padding: "50px 0" }} />
      </div>
    </div>
  );
};

export default NewsletterPage;
