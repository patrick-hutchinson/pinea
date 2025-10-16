import { AnimatePresence, motion } from "framer-motion";

const FadePresence = ({ children, className, customKey = "key" }) => (
  <AnimatePresence mode="popLayout">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className={className}
      key={customKey}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default FadePresence;
