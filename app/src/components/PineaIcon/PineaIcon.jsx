import styles from "./PineaIcon.module.css";

const PineaIcon = ({ className, onClick, src = "icons/pinea_rechteck.svg" }) => {
  const classes = [className, styles.pineaIcon].filter(Boolean).join(" ");

  return <img data-pinea-icon className={classes} onClick={onClick} src={src} />;
};

export default PineaIcon;
