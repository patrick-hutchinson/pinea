import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

import { isAuthEnabled } from "@/lib/runtimeFlags";

const isProduction = process.env.VERCEL_ENV === "production";
const isPreview = process.env.VERCEL_ENV === "preview";
const isLocal = !process.env.VERCEL_ENV;

export const getSanityClient = () => {
  if (isProduction) return "production";
  if (isPreview || isLocal) return "production";

  return "preview";
};

const client = getSanityClient();

const LoginButton = ({ isMobile, showMenu }) => {
  const router = useRouter();

  if (!isAuthEnabled) {
    return null;
  }

  return (
    <AnimatePresence mode="popLayout">
      {(!isMobile || (isMobile && showMenu)) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, transition: { duration: 0.5, delay: 1 } }}
          exit={{ opacity: 0, transition: { duration: 0.5, delay: 0 } }}
          style={{
            pointerEvents: client === "production" ? "none" : "all",
            opacity: 0.4,
            cursor: client === "production" ? "not-allowed" : "default",
          }}
        >
          <motion.button onClick={() => router.push("/login")}>Log In</motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginButton;
