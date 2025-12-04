import { AnimatePresence, motion } from "framer-motion";

const FadePresence = ({
  children,
  className,
  motionKey,
  onMouseEnter,
  onMouseLeave,
  onClick,
  onTouchStart,
  onTouchMove,

  onTouchEnd,
  delay,
}) => (
  <AnimatePresence mode="wait">
    {children && (
      <motion.div
        key={motionKey}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onClick={onClick}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{
          opacity: 0,
          transition: { duration: 0.4 }, // ⭐ exit has no delay
        }}
        transition={{ duration: 0.4, delay }}
        className={className}
      >
        {children}
      </motion.div>
    )}
  </AnimatePresence>
);

export default FadePresence;
