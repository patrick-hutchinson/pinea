import styles from "./Footer.module.css";

const NewsletterSignUp = () => (
  <div className={styles.newsletter}>
    <p>Stay Up to Date</p>
    <input type="email" name="email" placeholder="Subscribe to our Newsletter" autoComplete="email" required />
  </div>
);

export default NewsletterSignUp;
