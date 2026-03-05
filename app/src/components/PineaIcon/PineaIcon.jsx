import styles from "./PineaIcon.module.css";

const PineaIcon = ({ className, onClick }) => {
  return (
    <img
      data-pinea-icon
      className={`${className} ${styles.pineaIcon}`}
      onClick={onClick}
      src="icons/pinea_rechteck.svg"
    />
  );
};

export default PineaIcon;
