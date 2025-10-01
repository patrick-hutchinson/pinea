import Carousel from "@/components/Carousel/Carousel";
import Text from "@/components/Text";

import styles from "./Periodical.module.css";

const Periodical = ({ periodical }) => {
  return (
    <div className={styles.container}>
      <h3>{periodical.title}</h3>
      <Text text={periodical.description} />
      <Carousel images={periodical.images} />
    </div>
  );
};

export default Periodical;
