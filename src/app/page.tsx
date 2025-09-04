import Image from "next/image";
import styles from "./page.module.css";

import PictureBrush from "@/components/PictureBrush/PictureBrush";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <PictureBrush />
      </main>
    </div>
  );
}
