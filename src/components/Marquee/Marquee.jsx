import { motion } from "framer-motion";
import styles from "./Marquee.module.css";
import Media from "../Media";

const Marquee = ({ announcement }) => {
  const duplicatedAnnouncements = [...announcement, ...announcement];

  const Advert = ({ item }) => {
    return (
      <div className={styles.advert}>
        <h5 className={styles.type}>{item.type}</h5>
        <div className={styles.card}>
          <Media medium={item.thumbnail} />
        </div>
      </div>
    );
  };

  const Advertorial = ({ item }) => {
    return (
      <div className={styles.advertorial}>
        <h5 className={styles.type}>{item.type}</h5>
        <div className={styles.card}>
          <Media medium={item.thumbnail} />
        </div>
        <h5 className={styles.title}>{item.title}</h5>
        <h5>{item.category}</h5>
      </div>
    );
  };

  const Announcement = ({ item }) => {
    return (
      <div className={styles.announcement}>
        <h5 className={styles.type}>{item.type}</h5>
        <div className={styles.card}>
          <h3 className={`ff4 ${styles.title}`}>{item.title}</h3>
          <h3>{item.subtitle}</h3>
        </div>
        <h5>{item.category}</h5>
        <h5>{item.subcategory}</h5>
      </div>
    );
  };

  return (
    <div className={styles.marquee_outer}>
      <motion.ul
        className={styles.marquee_inner}
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 20, // adjust for speed
          },
        }}
      >
        {duplicatedAnnouncements.map((item, index) => (
          <li key={index}>
            {item.type === "advert" && <Advert item={item} />}
            {item.type === "announcement" && <Announcement item={item} />}
            {item.type === "advertorial" && <Advertorial item={item} />}
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Marquee;
