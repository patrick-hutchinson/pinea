"use client";

import { useRef, useState } from "react";

import Button from "@/components/Buttons/Button";
import Icon from "@/components/Icon/Icon";

import styles from "./ProfilePage.module.css";

const EVENT_TYPES = [
  "Exhibition",
  "Performance",
  "Workshop",
  "Symposium",
  "Fair",
  "Auction",
  "Event",
  "Festival",
  "Lecture",
  "Screening",
];

const ProfileClient = ({ session, manageSubscriptionUrl, site }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [eventOpening, setEventOpening] = useState("");
  const [eventWebsite, setEventWebsite] = useState("");
  const [artistName, setArtistName] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [workYear, setWorkYear] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadRemoveHover, setIsUploadRemoveHover] = useState(false);
  const uploadInputRef = useRef(null);

  const name = session?.name || "Member";
  const email = session?.email || "";
  const address = Array.isArray(session?.address) ? session.address : [];
  const isMock = Boolean(session?.isMock);
  const isUploaded = uploadStatus === "uploaded" && Boolean(fileName);
  const isFormComplete =
    Boolean(category) &&
    Boolean(eventTitle.trim()) &&
    Boolean(startDate.trim()) &&
    Boolean(endDate.trim()) &&
    Boolean(eventLocation.trim()) &&
    Boolean(eventOpening.trim()) &&
    Boolean(eventWebsite.trim()) &&
    Boolean(artistName.trim()) &&
    Boolean(workTitle.trim()) &&
    Boolean(workYear.trim()) &&
    isUploaded;

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.center}>
          <p typo="h3" className={styles.titleStrong}>
            Hello Member
          </p>
          <p typo="h3" className={styles.dimText}>
            You&apos;re currently subscribed to
          </p>
          <p typo="h3" className={styles.dimText}>
            P.I.N.E.A Member Plus
          </p>
        </div>

        <div>
          <h2 typo="h3" className={styles.titleStrong}>
            What&apos;s On
          </h2>
          <ul className={`${styles.list} ${styles.dimText}`} typo="h3">
            <li>Open Calls (+0)</li>
            <li>Access to Print Article Archiv (+0)</li>
            <li>Digital Bonus Material (+0)</li>
          </ul>
        </div>

        <div>
          <h2 typo="h3" className={styles.titleStrong}>
            Service
          </h2>
          <div className={styles.suggestionContainer}>
            <p typo="h3" className={styles.dimText}>
              Suggest your Event for Calendar
            </p>
            <Button onClick={() => setFormOpen((prev) => !prev)}>{formOpen ? "Close" : "Open"}</Button>
          </div>
          <div className={styles.suggestionContainer}>
            <p typo="h3" className={styles.dimText}>
              Suggest a Story
            </p>
            <Button onClick={() => window?.open(`mailto:${site.email}`)}>Reach Out</Button>
          </div>
        </div>
      </section>

      <section className={styles.manage}>
        <div>
          {manageSubscriptionUrl ? (
            <a href={manageSubscriptionUrl} target="_blank" className={styles.manageLink} typo="h3">
              Manage Subscription
            </a>
          ) : (
            <p typo="h3" className={styles.dimText}>
              Manage Subscription
            </p>
          )}
          {/* <p typo="h3" className={styles.dimText}>
            {name}
          </p>
          {address.map((line) => (
            <p key={line} typo="h3" className={styles.dimText}>
              {line}
            </p>
          ))}
          <p typo="h3" className={styles.dimText}>
            {email}
          </p> */}
        </div>
      </section>

      <section className={`${styles.formArea} ${formOpen ? styles.formOpen : ""}`} typo="h4">
        <form
          className={styles.formGrid}
          onSubmit={(event) => {
            event.preventDefault();
          }}
        >
          <div className={`${styles.entry} ${styles.type}`}>
            <p className={styles.formTitle}>Category</p>
            <div className={styles.selectList} role="radiogroup" aria-label="Event type">
              {EVENT_TYPES.map((type, index) => (
                <span key={type} className={styles.selectItemWrap}>
                  <button
                    type="button"
                    className={`${styles.selectItem} ${category === type ? styles.selectItemActive : ""}`}
                    onClick={() => setCategory(type)}
                    role="radio"
                    aria-checked={category === type}
                  >
                    {type}
                    {index < EVENT_TYPES.length - 1 ? ", " : ""}
                  </button>
                </span>
              ))}
            </div>
            <input type="hidden" name="eventCategory" value={category} />
          </div>

          <div className={`${styles.entry} ${styles.title}`}>
            <p className={styles.formTitle}>Title</p>
            <input
              className={styles.input}
              type="text"
              placeholder="Enter Event Title"
              value={eventTitle}
              onChange={(event) => setEventTitle(event.target.value)}
            />
          </div>

          <div className={`${styles.entry} ${styles.date}`}>
            <p className={styles.formTitle}>Date</p>
            <div className={styles.dateRange}>
              <input
                className={`${styles.input} ${styles.dateRangeInput}`}
                type="text"
                placeholder="DD.MM.YYYY"
                value={startDate}
                onChange={(event) => setStartDate(event.target.value)}
              />
              <span className={styles.dateRangeDivider}>-</span>
              <input
                className={`${styles.input} ${styles.dateRangeInput}`}
                type="text"
                placeholder="DD.MM.YYYY"
                value={endDate}
                onChange={(event) => setEndDate(event.target.value)}
              />
            </div>
          </div>

          <div className={`${styles.entry} ${styles.location}`}>
            <p className={styles.formTitle}>Location</p>
            <input
              className={styles.input}
              type="text"
              placeholder="Institution"
              value={eventLocation}
              onChange={(event) => setEventLocation(event.target.value)}
            />
          </div>

          <div className={`${styles.entry} ${styles.opening}`}>
            <p className={styles.formTitle}>Opening</p>
            <input
              className={styles.input}
              type="text"
              placeholder="DD.MM.YYYY"
              value={eventOpening}
              onChange={(event) => setEventOpening(event.target.value)}
            />
          </div>

          <div className={`${styles.entry} ${styles.website}`}>
            <p className={styles.formTitle}>Website</p>
            <input
              className={styles.input}
              type="url"
              placeholder="https://..."
              value={eventWebsite}
              onChange={(event) => setEventWebsite(event.target.value)}
            />
          </div>

          <div className={styles.upload}>
            <div>
              <input
                className={styles.input}
                type="text"
                placeholder="Artist Name"
                value={artistName}
                onChange={(event) => setArtistName(event.target.value)}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Title of Work"
                value={workTitle}
                onChange={(event) => setWorkTitle(event.target.value)}
              />
              <input
                className={styles.input}
                type="text"
                placeholder="Year of Origin"
                value={workYear}
                onChange={(event) => setWorkYear(event.target.value)}
              />
            </div>

            <input
              id="profile-upload"
              ref={uploadInputRef}
              className={styles.hiddenUpload}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={async (event) => {
                const file = event.target.files?.[0];
                if (!file) return;

                setUploadStatus("uploading");
                setFileName(file.name);
                setUploadProgress(0);
                setIsUploadRemoveHover(false);

                // Placeholder upload simulation until backend endpoint is connected.
                await new Promise((resolve) => {
                  const duration = 1200;
                  const start = performance.now();

                  const tick = (now) => {
                    const progress = Math.min(100, ((now - start) / duration) * 100);
                    setUploadProgress(progress);

                    if (progress < 100) {
                      window.requestAnimationFrame(tick);
                    } else {
                      resolve();
                    }
                  };

                  window.requestAnimationFrame(tick);
                });

                setUploadStatus("uploaded");
              }}
            />

            <div className={styles.formButtons}>
              <Button
                onClick={(event) => {
                  event.preventDefault();
                  if (uploadStatus === "uploading") return;
                  if (isUploaded) {
                    setUploadStatus("idle");
                    setUploadProgress(0);
                    setFileName("");
                    setIsUploadRemoveHover(false);
                    if (uploadInputRef.current) {
                      uploadInputRef.current.value = "";
                    }
                    return;
                  }
                  uploadInputRef.current?.click();
                }}
                onMouseEnter={() => {
                  if (isUploaded) setIsUploadRemoveHover(true);
                }}
                onMouseLeave={() => {
                  if (isUploaded) setIsUploadRemoveHover(false);
                }}
                className={`${styles.uploadButton} ${
                  uploadStatus === "uploading" ? styles.uploadingButton : isUploaded ? styles.uploadedButton : ""
                } ${isUploaded && isUploadRemoveHover ? styles.uploadedButtonRemoveHover : ""}`}
                style={{ "--upload-progress": `${uploadProgress}%` }}
              >
                {isUploaded ? (
                  <span className={styles.uploadTickWrap}>
                    {isUploadRemoveHover ? (
                      <span className={styles.uploadRemoveIcon}>&times;</span>
                    ) : (
                      <Icon path="/icons/tick.svg" className={styles.uploadTick} />
                    )}
                  </span>
                ) : uploadStatus === "uploading" ? (
                  "Uploading"
                ) : (
                  "Upload"
                )}
              </Button>
              <Button
                className={`${styles.sendButton} ${!isFormComplete ? styles.sendButtonDisabled : ""}`}
                disabled={!isFormComplete}
              >
                Send
              </Button>
            </div>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ProfileClient;
