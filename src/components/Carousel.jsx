import { useState, useEffect } from "react";
import Media from "@/components/Media";
import { motion, AnimatePresence } from "framer-motion";

const Carousel = ({ periodical }) => {
  console.log(periodical);

  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % periodical.images.length);
    }, 2000); // every 2 seconds

    return () => clearInterval(interval); // cleanup on unmount
  }, [periodical.images.length]);

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.75 }}
        key={periodical.images[current].url}
      >
        <Media medium={periodical.images[current]} />
      </motion.div>
    </AnimatePresence>
  );
};

export default Carousel;
