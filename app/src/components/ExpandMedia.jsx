import { motion } from "framer-motion";
import Media from "@/components/Media/Media";

const ExpandMedia = ({ medium, copyright, className }) => {
  const maxHeight = 600;
  const initialScale = (maxHeight - 80) / maxHeight; // 0.867

  return (
    <>
      <motion.div
        className={className}
        initial={{ scale: initialScale }}
        whileHover={{ scale: 1, transition: { duration: 0.2 } }}
        style={{ maxHeight: "100%", zIndex: 2, display: "flex" }}
      >
        <Media medium={medium} objectFit="contain" copyright={copyright} />
      </motion.div>
    </>
  );
};

export default ExpandMedia;
