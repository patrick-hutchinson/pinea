import { AnimatePresence, motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";

const LoginButton = ({ isMobile, showMenu, authEnabled = true, isAuthenticated = false }) => {
  const router = useRouter();
  const pathname = usePathname();
  const disabled = !authEnabled;

  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
          style={disabled ? { cursor: "not-allowed" } : undefined}
        >
          <motion.button
            onClick={() => {
              if (isAuthenticated) {
                const returnTo = pathname || "/";
                window.location.assign(`/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`);
                return;
              }
              if (disabled) return;
              router.push("/login");
            }}
            style={disabled && !isAuthenticated ? { opacity: 0.4, pointerEvents: "none" } : undefined}
            aria-disabled={disabled && !isAuthenticated}
          >
            {isAuthenticated ? "Log Out" : "Log In"}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginButton;
