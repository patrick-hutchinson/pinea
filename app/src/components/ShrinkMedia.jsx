import { motion } from "framer-motion";

import Media from "@/components/Media/Media";
import { useContext, useState } from "react";

import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";

const ShrinkMedia = ({ caption = "", medium, copyright }) => {
  const [scale, setScale] = useState(1);

  const { line_height_4, caption_gap } = useContext(GlobalVariablesContext);

  const handleLoaded = (mediaHeight) => {
    if (!mediaHeight) return;

    // Use it in your calculation
    const subtraction = (line_height_4 + caption_gap * 1.5) * 2;

    setScale((mediaHeight - subtraction) / mediaHeight);
  };

  return (
    <>
      <motion.div
        whileHover={{ scale: scale, transition: { duration: 0.2 } }}
        style={{ maxHeight: "600px", zIndex: 2, display: "flex" }}
      >
        <Media medium={medium} objectFit="contain" copyright={copyright} handleLoaded={handleLoaded} />
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
