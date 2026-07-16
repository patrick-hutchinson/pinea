import styles from "./PineaIcon.module.css";

const PineaIcon = ({
  className,
  isShopIcon = false,
  preserveBackdropBlurTarget = false,
  onClick,
  src = "/icons/pinea_rechteck.svg",
}) => {
  const classes = [className, styles.pineaIcon].filter(Boolean).join(" ");

  return (
    <img
      data-pinea-icon
      data-home-backdrop-icon={preserveBackdropBlurTarget ? true : undefined}
      data-shop-icon={isShopIcon ? true : undefined}
      className={classes}
      onClick={onClick}
      src={src}
    />
  );
};

export default PineaIcon;
