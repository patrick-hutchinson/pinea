import Text from "@/components/Text/Text";
import styles from "./Quote.module.css";

const Quote = ({ text, className }) => {
  return (
    <div className={`${styles.quote} ${className || ""}`}>
      <Text text={text} className={styles.inlineText} />
    </div>
  );
};

export default Quote;
