import { motion } from "framer-motion";
import Media from "@/components/Media";

const ShrinkMedia = ({ medium }) => {
  return (
    <>
      <motion.div
        whileHover={{ scale: 0.85, transition: { duration: 0.2 } }}
        transition={{ duration: 0.2 }}
        style={{ maxHeight: "100%", zIndex: 2, width: "100%" }}
      >
        <Media medium={medium} />
      </motion.div>
      <p
        className="ff4"
        style={{
          position: "relative",

          textAlign: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        Media Title, Media Curator
      </p>
    </>
  );
};

export default ShrinkMedia;
