import styles from "./VoicePage.module.css";

const VoicePage = ({ voice }) => {
  console.log(voice, "voices");
  return <main className={styles.main}>{voice.name}</main>;
};

export default VoicePage;
