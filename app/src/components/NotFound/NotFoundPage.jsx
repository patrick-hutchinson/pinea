"use client";

import { useEffect } from "react";

import PictureBrush from "@/components/PictureBrush/PictureBrush";
import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./NotFoundPage.module.css";

const NotFoundPage = ({ images }) => {
  useEffect(() => {
    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  return (
    <main className={styles.root}>
      <PictureBrush images={images} hasEntered={false} />
      <div className={styles.content}>
        <p className={styles.message}>Oops, this page doesn&apos;t exist. Here&apos;s the way</p>
        <AnimationLink className={styles.link} path="/">
          Home
        </AnimationLink>
      </div>
    </main>
  );
};

export default NotFoundPage;
