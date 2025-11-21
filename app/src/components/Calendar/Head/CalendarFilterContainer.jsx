import styles from "../Calendar.module.css";
import { motion } from "framer-motion";
import { useEffect } from "react";

const CalendarFilterContainer = ({ children, show }) => {
  const scaleVariants = {
    hidden: {
      maxHeight: 0,
      transition: { delay: 0.3, duration: 0.4, ease: "easeInOut" }, // delay applies here
    },
    visible: {
      maxHeight: 150,
      transition: { duration: 0.4, ease: "easeInOut" },
    },
  };

  const opacityVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        opacity: { delay: 0.3, duration: 0.2, ease: "easeInOut" },
      },
    },
  };
  return (
    <motion.div
      className={styles.date_selection}
      initial="hidden"
      animate={show ? "visible" : "hidden"}
      variants={scaleVariants} // controls maxHeight
      style={{ transformOrigin: "top" }}
    >
      <motion.div
        className={styles.date_selection_inner}
        initial="hidden"
        animate={show ? "visible" : "hidden"}
        variants={opacityVariants} // controls opacity
        typo="h4"
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default CalendarFilterContainer;
