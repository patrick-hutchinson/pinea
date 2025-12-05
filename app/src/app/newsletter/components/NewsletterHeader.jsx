import Button from "@/components/Button/Button";

import styles from "../Newsletter.module.css";

const NewsletterHeader = ({ site, newsletter }) => {
  return (
    <header className={styles.header}>
      <a href="https://www.pinea-periodical.com">{site.title}</a>
      <div className={styles.controls}>
        <div>{newsletter.release}</div>
        <Button>English</Button>
      </div>
    </header>
  );
};

export default NewsletterHeader;
