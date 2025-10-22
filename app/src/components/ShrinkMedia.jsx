import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

const ShrinkMedia = ({ caption = "", medium, copyright }) => {
  const maxHeight = 600;
  const scale = (maxHeight - 80) / maxHeight; // 0.867

  return (
    <>
      <motion.div
        whileHover={{ scale: scale, transition: { duration: 0.2 } }}
        style={{ maxHeight: "100%", zIndex: 2, display: "flex" }}
      >
        <Media medium={medium} objectFit="contain" copyright={copyright} />
      </motion.div>

      <motion.div
        typo="h4"
        variants={{
          rest: { opacity: 0, transition: { duration: 0.3 } },
          hover: { opacity: 1, transition: { duration: 0.3 } },
        }}
        style={{
          position: "relative",
          bottom: "20px",
          textAlign: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        <p>{caption}</p>
      </motion.div>
    </>
  );
};

export default ShrinkMedia;
