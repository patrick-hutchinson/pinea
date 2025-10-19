import { AnimatePresence, motion } from "framer-motion";

const FadePresence = ({ children, className, motionKey }) => (
  <AnimatePresence mode="popLayout">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      className={className}
      key={motionKey}
    >
      {children}
    </motion.div>
  </AnimatePresence>
);

export default FadePresence;
