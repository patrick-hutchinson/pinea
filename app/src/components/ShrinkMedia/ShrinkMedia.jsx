import { motion } from "framer-motion";
import Media from "@/components/Media/Media";
import { useContext, useEffect, useRef, useState } from "react";
import { GlobalVariablesContext } from "@/context/GlobalVariablesContext";
import TextMarquee from "@/components/TextMarquee/TextMarquee";

import styles from "./ShrinkMedia.module.css";

const ShrinkMedia = ({ caption, medium, isActive }) => {
  const [mediaWidth, setMediaWidth] = useState(null);
  const mediaRef = useRef(null);
  const { line_height_4, caption_gap } = useContext(GlobalVariablesContext);

  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!mediaRef.current) return;

    const mediaHeight = mediaRef.current.getBoundingClientRect().height;

    if (isActive) {
      console.log(isActive);
      const subtraction = (line_height_4 * 10 + caption_gap) * 2;
      setScale((mediaHeight - subtraction) / mediaHeight);
    } else {
      setScale(1); // reset scale when not active
    }
  }, [isActive]);

  // Define variants
  const mediaVariants = {
    rest: { scale: 1, transition: { duration: 0.2 } },
    hover: { scale: scale, transition: { duration: 0.2 } },
  };

  const captionVariants = {
    rest: { opacity: 0, transition: { duration: 0.3 } },
    hover: { opacity: 1, transition: { duration: 0.3 } },
  };

  return (
    <motion.div
      initial="rest"
      whileHover="hover"
      onHoverStart={() => console.log("hover start")}
      onHoverEnd={() => console.log("hover end")}
      animate="rest"
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        maxHeight: "100%",
      }}
    >
      {/* Child that scales */}
      <motion.div
        variants={mediaVariants}
        style={{
          maxHeight: "100%",
          zIndex: 2,
          display: "flex",
        }}
      >
        <Media ref={mediaRef} medium={medium} objectFit="contain" onWidth={(w) => setMediaWidth(w)} />
      </motion.div>

      <motion.div
        typo="h4"
        variants={captionVariants}
        style={{
          position: "relative",
          bottom: "20px",
          textAlign: "center",
          width: "100%",
          zIndex: 1,
        }}
      >
        {/* <p>{caption}</p> */}
        <div className={styles.caption} typo="h4">
          <div className={styles.caption_text} style={{ width: "100%" }}>
            <TextMarquee text={caption} mediaWidth={mediaWidth} activeElement={true} fontSize={13} />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default ShrinkMedia;
