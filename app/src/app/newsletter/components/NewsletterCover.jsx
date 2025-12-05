import styles from "../Newsletter.module.css";

const NewsletterCover = ({ src }) => {
  return (
    <div className={styles.cover_container}>
      <img src={src} />
    </div>
  );
};

export default NewsletterCover;
