import { useState, useEffect } from "react";

import { AnimatePresence, motion } from "framer-motion";

import styles from "../Footer.module.css";

const FooterLogos = ({ logos }) => {
  console.log(logos[0].asset.url, "logos");
  const [index, setIndex] = useState(null);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % logos.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [logos.length]);

  const logo = logos[index];

  if (!logo) return null;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
      >
        <img className={styles.icon} src={logo?.asset.url} onClick={() => window.open(logo.link, "_blank")} />
      </motion.div>
    </AnimatePresence>
  );
};

export default FooterLogos;
