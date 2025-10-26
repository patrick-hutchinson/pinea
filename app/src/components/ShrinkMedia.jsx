import { motion } from "framer-motion";

import Media from "@/components/Media/Media";
import { useState } from "react";

const ShrinkMedia = ({ caption = "", medium, copyright }) => {
  const [scale, setScale] = useState(1);

  const handleLoaded = (mediaHeight) => {
    if (!mediaHeight) return;

    const root = document.documentElement;
    const lineHeight = getComputedStyle(root).getPropertyValue("--line-height-4");
    const captionGap = getComputedStyle(root).getPropertyValue("--caption-gap");
    const lineHeightValue = parseFloat(lineHeight);
    const captionGapValue = parseFloat(captionGap);

    // Use it in your calculation
    const subtraction = (lineHeightValue + captionGapValue * 2) * 2;

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
