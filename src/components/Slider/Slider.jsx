import { motion } from "framer-motion";
import styles from "./Slider.module.css";
import Media from "../Media";

const Slider = ({ announcement }) => {
  const duplicatedAnnouncements = [...announcement, ...announcement, ...announcement];

  return (
    <div className={styles.announcements_outer}>
      <motion.ul
        className={styles.announcements_inner}
        animate={{ x: ["0%", "-50%"] }} // Arbitrary Value that seems to work for now
        transition={{
          x: {
            repeat: Infinity,
            repeatType: "loop",
            ease: "linear",
            duration: 20, // adjust for speed
          },
        }}
      >
        {duplicatedAnnouncements.map((item, idx) => (
          <li key={idx}>
            <div className={`${styles.card} ${item.isAdvert ? styles.advert : styles.announcement}`}>
              <h3>{item.title}</h3>
              <Media medium={item.thumbnail} />
              <h3>{item.topics}</h3>
            </div>
            <h4>{item.category}</h4>
            <h4>{item.subcategory}</h4>
          </li>
        ))}
      </motion.ul>
    </div>
  );
};

export default Slider;
