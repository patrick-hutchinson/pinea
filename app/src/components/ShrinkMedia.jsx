import { motion } from "framer-motion";
import Media from "@/components/Media";
import { useRef, useState, useEffect } from "react";

const ShrinkMedia = ({ medium }) => {
  const ref = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (!ref.current) return;

    const observer = new ResizeObserver(([entry]) => {
      const height = entry.contentRect.height;

      setScale((height - 80) / height);
    });

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <motion.div
        ref={ref}
        whileHover={{ scale: scale, transition: { duration: 0.2 } }}
        transition={{ duration: 0.2 }}
        style={{ maxHeight: "100%", zIndex: 2, width: "100%" }}
      >
        <Media medium={medium} />
      </motion.div>
      <p
        className="ff4"
        style={{
          position: "relative",
          bottom: "20px",

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
