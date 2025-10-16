import { AnimatePresence, motion } from "framer-motion";

const FadePresence = ({ children, className, key = "key" }) => (
  <AnimatePresence mode="popLayout">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={className}
      key={key}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default FadePresence;
