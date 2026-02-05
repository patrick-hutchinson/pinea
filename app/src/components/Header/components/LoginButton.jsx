import { AnimatePresence, motion } from "framer-motion";

const LoginButton = ({ isMobile, showMenu }) => {
  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
          className="not-allowed"
        >
          <motion.button layout>Log In</motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginButton;
