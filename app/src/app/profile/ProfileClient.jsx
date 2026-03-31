"use client";

import { useState } from "react";

import Button from "@/components/Buttons/Button";

import styles from "./ProfilePage.module.css";

const ProfileClient = ({ session }) => {
  const [formOpen, setFormOpen] = useState(false);

  const name = session?.name || "Member";
  const email = session?.email || "";

  return (
    <main className={styles.page}>
      <section className={styles.top}>
        <div className={styles.left} typo="h2">
          Photography Intermedia Et Al.
        </div>

        <div className={styles.center}>
          <p typo="h2">Hello {name}</p>
          <p typo="h3">You&apos;re currently subscribed to</p>
          <p typo="h2">P.I.N.E.A Member Plus</p>
        </div>

        <div className={styles.right}>
          <p typo="h2">Manage Subscription</p>
          <p typo="h3">{email}</p>
          <a href="/api/auth/logout?returnTo=/" className={styles.logoutLink} typo="h5">
            LOGOUT
          </a>
        </div>
      </section>

      <section className={styles.section}>
        <h2 typo="h2">What&apos;s On</h2>
        <ul className={styles.list} typo="h2">
          <li>Open Calls (+0)</li>
          <li>Access to Print Article Archiv (+0)</li>
          <li>Digital Bonus Material (+0)</li>
        </ul>
      </section>

      <section className={styles.section}>
        <h2 typo="h2">Service</h2>
        <p typo="h2">Suggest your Event for Calendar</p>
        <Button onClick={() => setFormOpen((prev) => !prev)}>{formOpen ? "Close" : "Open"}</Button>
      </section>

      <section className={`${styles.formArea} ${formOpen ? styles.formOpen : ""}`}>
        <div className={styles.formGrid}>
          <div className={styles.column}>
            <p typo="h5">Select</p>
            <p typo="h5">Exhibition, Performance, Workshop, Symposium, Fair, Auction, Event, Festival, Lecture, Screening</p>
          </div>
          <div className={styles.column}>
            <p typo="h5">Title</p>
            <p typo="h5">Date</p>
            <p typo="h5">Location</p>
          </div>
          <div className={styles.column}>
            <p typo="h5">Enter Event</p>
            <p typo="h5">DD.MM.YYYY - DD.MM.YYYY</p>
            <p typo="h5">Institution</p>
          </div>
          <div className={styles.column}>
            <p typo="h5">Opening</p>
            <p typo="h5">DD.MM.YYYY</p>
            <p typo="h5">Website</p>
          </div>
          <div className={styles.column}>
            <p typo="h5">Artistname, Title Of Work, Year Of Origin (800 Px, Jpg)</p>
            <div className={styles.formButtons}>
              <Button>Upload</Button>
              <Button>Send</Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default ProfileClient;
