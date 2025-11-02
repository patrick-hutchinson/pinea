import Text from "@/components/Text/Text";
import styles from "./Quote.module.css";

const Quote = ({ text, className }) => {
  return (
    <div className={`${styles.quote} ${className || ""}`}>
      <span className={styles.mark}>“</span>
      <Text text={text} className={styles.inlineText} />
      <span className={styles.mark}>”</span>
    </div>
  );
};

export default Quote;
