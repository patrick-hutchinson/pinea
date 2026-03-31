import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { isAuthEnabled } from "@/lib/runtimeFlags";

const LoginButton = ({ isMobile, showMenu }) => {
  const router = useRouter();
  const disabled = !isAuthEnabled;

  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
        >
          <motion.button
            onClick={() => {
              if (disabled) return;
              router.push("/login");
            }}
            style={disabled ? { opacity: 0.4, cursor: "not-allowed", pointerEvents: "auto" } : undefined}
            aria-disabled={disabled}
          >
            Log In
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginButton;
