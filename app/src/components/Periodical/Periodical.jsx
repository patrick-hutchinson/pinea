import Slideshow from "@/components/Slideshow/Slideshow";
import Text from "@/components/Text/Text";

import styles from "./Periodical.module.css";

const Periodical = ({ periodical }) => {
  console.log("periodical:", periodical);
  return (
    <div className={styles.container}>
      <h3>{periodical.title}</h3>
      <Text text={periodical.description} />
      <Slideshow images={periodical.images} />
    </div>
  );
};

export default Periodical;
