import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "@/context/RouteContext";
import { getLocaleFromPathname, stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n";

import styles from "../Header.module.css";

const LoginButton = ({ isMobile, showMenu, authEnabled = true, isAuthenticated = false }) => {
  const pathname = usePathname();
  const locale = getLocaleFromPathname(pathname || "/");
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const isProfileRoute = basePathname === "/profile" || basePathname.startsWith("/profile/");
  const disabled = !authEnabled;

  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
          style={disabled ? { cursor: "not-allowed" } : undefined}
          className={styles.loginButton}
        >
          <motion.button
            onClick={() => {
              if (isAuthenticated) {
                if (isProfileRoute) {
                  const returnTo = withLocalePathname("/", locale);
                  window.location.assign(`/api/auth/logout?returnTo=${encodeURIComponent(returnTo)}`);
                  return;
                }

                window.location.assign(withLocalePathname("/profile", locale));
                return;
              }
              if (disabled) return;
              window.location.assign("/api/auth/shopify/start?returnTo=/profile");
            }}
            style={disabled && !isAuthenticated ? { opacity: 0.4, pointerEvents: "none" } : undefined}
            aria-disabled={disabled && !isAuthenticated}
          >
            {isAuthenticated ? (isProfileRoute ? "Log Out" : "Profile") : "Log In"}
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginButton;
