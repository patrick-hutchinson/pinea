import { motion } from "framer-motion";
import Media from "@/components/Media";

const ShrinkMedia = ({ item }) => {
  const maxHeight = 600;
  const scale = (maxHeight - 80) / maxHeight; // 0.867

  return (
    <>
      <motion.div
        whileHover={{ scale: scale, transition: { duration: 0.2 } }}
        style={{ maxHeight: "100%", width: "100%", zIndex: 2 }}
      >
        <Media medium={item.medium} />
      </motion.div>

      <div
        typo="h4"
        style={{
          position: "relative",
          bottom: "20px",
          textAlign: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        <p>
          <i>{item.artist}</i>, {item.title}
        </p>
      </div>
    </>
  );
};

export default ShrinkMedia;
