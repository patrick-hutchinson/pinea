"use client";

import { useEffect, useRef, useState } from "react";

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

const sanitizeDatePart = (value, maxLength) => value.replace(/\D/g, "").slice(0, maxLength);
const getMeasureText = (value, placeholder) => (value.length > placeholder.length ? value : placeholder);
const getDateParts = (date) => ({
  day: String(date.getDate()).padStart(2, "0"),
  month: String(date.getMonth() + 1).padStart(2, "0"),
  year: String(date.getFullYear()),
});

const formatDateFromParts = ({ day, month, year }) => {
  if (!day || !month || !year) return "";
  return `${day}.${month}.${year}`;
};

const ProfileClient = ({ session, manageSubscriptionUrl, site, countries = [] }) => {
  const [formOpen, setFormOpen] = useState(false);
  const [category, setCategory] = useState("");
  const [eventTitle, setEventTitle] = useState("");
  const [startDate, setStartDate] = useState({ day: "", month: "", year: "" });
  const [endDate, setEndDate] = useState({ day: "", month: "", year: "" });
  const [eventLocation, setEventLocation] = useState({
    institution: "",
    city: "",
    country: "",
  });
  const [openingDate, setOpeningDate] = useState({ day: "", month: "", year: "" });
  const [openingTime, setOpeningTime] = useState("");
  const [eventWebsite, setEventWebsite] = useState("");
  const [artistName, setArtistName] = useState("");
  const [workTitle, setWorkTitle] = useState("");
  const [workYear, setWorkYear] = useState("");
  const [uploadedImageAssetId, setUploadedImageAssetId] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("idle");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadRemoveHover, setIsUploadRemoveHover] = useState(false);
  const [submitStatus, setSubmitStatus] = useState("idle");
  const [submitMessage, setSubmitMessage] = useState("");
  const [locationWidths, setLocationWidths] = useState({
    institution: 0,
    city: 0,
    country: 0,
  });
  const [dateWidths, setDateWidths] = useState({
    startDay: 0,
    startMonth: 0,
    startYear: 0,
    endDay: 0,
    endMonth: 0,
    endYear: 0,
    openingDay: 0,
    openingMonth: 0,
    openingYear: 0,
  });
  const [workTitleWidth, setWorkTitleWidth] = useState(0);
  const [resizeTick, setResizeTick] = useState(0);
  const uploadInputRef = useRef(null);
  const institutionMeasureRef = useRef(null);
  const cityMeasureRef = useRef(null);
  const countryMeasureRef = useRef(null);
  const startDayMeasureRef = useRef(null);
  const startMonthMeasureRef = useRef(null);
  const startYearMeasureRef = useRef(null);
  const endDayMeasureRef = useRef(null);
  const endMonthMeasureRef = useRef(null);
  const endYearMeasureRef = useRef(null);
  const openingDayMeasureRef = useRef(null);
  const openingMonthMeasureRef = useRef(null);
  const openingYearMeasureRef = useRef(null);
  const workTitleMeasureRef = useRef(null);

  const firstNameFromSession = session?.name?.trim()?.split(/\s+/)?.[0] || "Member";
  const email = session?.email || "";
  const address = Array.isArray(session?.address) ? session.address : [];
  const isMock = Boolean(session?.isMock);
  const greetingName = isMock ? "Lola" : firstNameFromSession;
  const isUploaded = uploadStatus === "uploaded" && Boolean(fileName);
  const startDateValue = formatDateFromParts(startDate);
  const endDateValue = formatDateFromParts(endDate);
  const openingDateValue = formatDateFromParts(openingDate);
  const todayDateParts = getDateParts(new Date());
  const tomorrowDate = new Date();
  tomorrowDate.setDate(tomorrowDate.getDate() + 1);
  const tomorrowDateParts = getDateParts(tomorrowDate);
  const selectedCountryLabel = countries.find((country) => country._id === eventLocation.country)?.label || "Country";
  const hasUploadedImage = Boolean(uploadedImageAssetId);
  const hasRequiredImageMetadata = Boolean(artistName.trim()) && Boolean(workTitle.trim()) && Boolean(workYear.trim());
  const isFormComplete =
    Boolean(category) &&
    Boolean(eventTitle.trim()) &&
    Boolean(startDateValue) &&
    Boolean(endDateValue) &&
    Boolean(eventLocation.institution.trim()) &&
    Boolean(eventLocation.city.trim()) &&
    Boolean(eventLocation.country) &&
    (!hasUploadedImage || hasRequiredImageMetadata);

  const updateLocationField = (field) => (event) => {
    setEventLocation((prev) => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const updateDateField = (setter, key, maxLength) => (event) => {
    const next = sanitizeDatePart(event.target.value, maxLength);
    setter((prev) => ({
      ...prev,
      [key]: next,
    }));
  };

  const handleUploadButtonClick = (event) => {
    event.preventDefault();
    if (uploadStatus === "uploading") return;
    if (isUploaded) {
      setUploadStatus("idle");
      setUploadProgress(0);
      setFileName("");
      setUploadedImageAssetId("");
      setIsUploadRemoveHover(false);
      if (uploadInputRef.current) {
        uploadInputRef.current.value = "";
      }
      return;
    }
    uploadInputRef.current?.click();
  };

  useEffect(() => {
    let frameId = null;

    const onResize = () => {
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }

      frameId = window.requestAnimationFrame(() => {
        setResizeTick((prev) => prev + 1);
      });
    };

    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      if (frameId) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  useEffect(() => {
    const institutionWidth = (institutionMeasureRef.current?.offsetWidth || 0) + 8;
    const cityWidth = (cityMeasureRef.current?.offsetWidth || 0) + 8;
    const countryWidth = (countryMeasureRef.current?.offsetWidth || 0) + 20;

    setLocationWidths({
      institution: institutionWidth,
      city: cityWidth,
      country: countryWidth,
    });
  }, [eventLocation.institution, eventLocation.city, selectedCountryLabel, resizeTick]);

  useEffect(() => {
    setDateWidths({
      startDay: startDayMeasureRef.current?.offsetWidth || 0,
      startMonth: startMonthMeasureRef.current?.offsetWidth || 0,
      startYear: startYearMeasureRef.current?.offsetWidth || 0,
      endDay: endDayMeasureRef.current?.offsetWidth || 0,
      endMonth: endMonthMeasureRef.current?.offsetWidth || 0,
      endYear: endYearMeasureRef.current?.offsetWidth || 0,
      openingDay: openingDayMeasureRef.current?.offsetWidth || 0,
      openingMonth: openingMonthMeasureRef.current?.offsetWidth || 0,
      openingYear: openingYearMeasureRef.current?.offsetWidth || 0,
    });
  }, [
    startDate.day,
    startDate.month,
    startDate.year,
    endDate.day,
    endDate.month,
    endDate.year,
    openingDate.day,
    openingDate.month,
    openingDate.year,
    resizeTick,
  ]);

  useEffect(() => {
    setWorkTitleWidth(workTitleMeasureRef.current?.offsetWidth || 0);
  }, [workTitle, resizeTick]);

  return (
    <main className={styles.main}>
      <section className={styles.section}>
        <div className={styles.center}>
          <p typo="h3" className={styles.titleStrong}>
            {`Hello ${greetingName}!`}
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
              Submit your Event
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
          onSubmit={async (event) => {
            event.preventDefault();

            if (!isFormComplete || submitStatus === "submitting") return;

            setSubmitStatus("submitting");
            setSubmitMessage("");

            try {
              const response = await fetch("/api/profile/suggest-event", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  category,
                  title: eventTitle.trim(),
                  startDate: startDateValue,
                  endDate: endDateValue,
                  location: {
                    institution: eventLocation.institution.trim(),
                    city: eventLocation.city.trim(),
                    countryId: eventLocation.country,
                  },
                  opening: {
                    date: openingDateValue,
                    time: openingTime.trim(),
                  },
                  website: eventWebsite.trim(),
                  artistName: artistName.trim(),
                  imageMeta: {
                    artistName: artistName.trim(),
                    workTitle: workTitle.trim(),
                    workYear: workYear.trim(),
                    fileName,
                  },
                  uploadedImageAssetId,
                }),
              });

              const result = await response.json().catch(() => ({}));
              if (!response.ok) {
                throw new Error(result?.error || "Could not submit event.");
              }

              setSubmitStatus("success");
              setSubmitMessage("Event draft created.");
            } catch (error) {
              setSubmitStatus("error");
              setSubmitMessage(error instanceof Error ? error.message : "Could not submit event.");
            }
          }}
        >
          <div className={styles.eventDataWrapper}>
            <div className={`${styles.entry} ${styles.type}`}>
              <p className={styles.formTitle}>Category</p>
              <div className={styles.selectList} role="radiogroup" aria-label="Event type">
                {EVENT_TYPES.map((type, index) => (
                  <span key={type} className={styles.selectItemWrap}>
                    <button
                      type="button"
                      className={`${styles.selectItem} ${category === type ? styles.selectItemActive : ""}`}
                      onClick={() => setCategory((prev) => (prev === type ? "" : type))}
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
              <p className={styles.formTitle}>Event</p>
              <input
                className={styles.input}
                type="text"
                placeholder="Title"
                value={eventTitle}
                onChange={(event) => setEventTitle(event.target.value)}
              />
            </div>

            <div className={`${styles.entry} ${styles.artist}`}>
              <p className={styles.formTitle}>Artist</p>
              <input
                className={styles.input}
                type="text"
                placeholder="Name"
                value={artistName}
                onChange={(event) => setArtistName(event.target.value)}
              />
            </div>

            <div className={`${styles.entry} ${styles.date}`}>
              <p className={styles.formTitle}>Date</p>
              <div className={styles.dateRange}>
                <div className={styles.dateParts}>
                  <input
                    className={`${styles.input} ${styles.datePartInput}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={todayDateParts.day}
                    value={startDate.day}
                    style={{ width: dateWidths.startDay ? `${dateWidths.startDay}px` : undefined }}
                    onChange={updateDateField(setStartDate, "day", 2)}
                  />
                  <span className={styles.datePartDot}>.</span>
                  <input
                    className={`${styles.input} ${styles.datePartInput}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={todayDateParts.month}
                    value={startDate.month}
                    style={{ width: dateWidths.startMonth ? `${dateWidths.startMonth}px` : undefined }}
                    onChange={updateDateField(setStartDate, "month", 2)}
                  />
                  <span className={styles.datePartDot}>.</span>
                  <input
                    className={`${styles.input} ${styles.datePartInput}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={todayDateParts.year}
                    value={startDate.year}
                    style={{ width: dateWidths.startYear ? `${dateWidths.startYear}px` : undefined }}
                    onChange={updateDateField(setStartDate, "year", 4)}
                  />
                </div>
                <span className={`${styles.dateRangeDivider}`} style={{ padding: "0 3px" }}>
                  -
                </span>
                <div className={styles.dateParts}>
                  <input
                    className={`${styles.input} ${styles.datePartInput}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={tomorrowDateParts.day}
                    value={endDate.day}
                    style={{ width: dateWidths.endDay ? `${dateWidths.endDay}px` : undefined }}
                    onChange={updateDateField(setEndDate, "day", 2)}
                  />
                  <span className={styles.datePartDot}>.</span>
                  <input
                    className={`${styles.input} ${styles.datePartInput}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={tomorrowDateParts.month}
                    value={endDate.month}
                    style={{ width: dateWidths.endMonth ? `${dateWidths.endMonth}px` : undefined }}
                    onChange={updateDateField(setEndDate, "month", 2)}
                  />
                  <span className={styles.datePartDot}>.</span>
                  <input
                    className={`${styles.input} ${styles.datePartInput}`}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    placeholder={tomorrowDateParts.year}
                    value={endDate.year}
                    style={{ width: dateWidths.endYear ? `${dateWidths.endYear}px` : undefined }}
                    onChange={updateDateField(setEndDate, "year", 4)}
                  />
                </div>
              </div>
              <input type="hidden" name="eventStartDate" value={startDateValue} />
              <input type="hidden" name="eventEndDate" value={endDateValue} />
            </div>

            <div className={`${styles.entry} ${styles.opening}`}>
              <p className={styles.formTitle}>Opening</p>
              <div className={styles.dateParts}>
                <input
                  className={`${styles.input} ${styles.datePartInput}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={todayDateParts.day}
                  value={openingDate.day}
                  style={{ width: dateWidths.openingDay ? `${dateWidths.openingDay}px` : undefined }}
                  onChange={updateDateField(setOpeningDate, "day", 2)}
                />
                <span className={styles.datePartDot}>.</span>
                <input
                  className={`${styles.input} ${styles.datePartInput}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={todayDateParts.month}
                  value={openingDate.month}
                  style={{ width: dateWidths.openingMonth ? `${dateWidths.openingMonth}px` : undefined }}
                  onChange={updateDateField(setOpeningDate, "month", 2)}
                />
                <span className={styles.datePartDot}>.</span>
                <input
                  className={`${styles.input} ${styles.datePartInput}`}
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  placeholder={todayDateParts.year}
                  value={openingDate.year}
                  style={{ width: dateWidths.openingYear ? `${dateWidths.openingYear}px` : undefined }}
                  onChange={updateDateField(setOpeningDate, "year", 4)}
                />
              </div>
              <input
                className={styles.input}
                type="text"
                placeholder="16:00"
                value={openingTime}
                onChange={(event) => setOpeningTime(event.target.value)}
                style={{ paddingLeft: "8px" }}
              />
              <input type="hidden" name="eventOpeningDate" value={openingDateValue} />
              <input type="hidden" name="eventOpeningTime" value={openingTime} />
            </div>

            <div className={`${styles.entry} ${styles.location}`}>
              <p className={styles.formTitle}>Location</p>
              <div className={styles.locationFields}>
                <input
                  className={styles.input}
                  type="text"
                  placeholder="Institution"
                  value={eventLocation.institution}
                  maxLength={64}
                  style={{ width: locationWidths.institution ? `${locationWidths.institution}px` : undefined }}
                  onChange={updateLocationField("institution")}
                />
                <input
                  className={styles.input}
                  type="text"
                  placeholder="City"
                  value={eventLocation.city}
                  maxLength={40}
                  style={{ width: locationWidths.city ? `${locationWidths.city}px` : undefined }}
                  onChange={updateLocationField("city")}
                />
                <select
                  className={`${styles.input} ${styles.selectInput}`}
                  value={eventLocation.country}
                  style={{ width: locationWidths.country ? `${locationWidths.country}px` : undefined }}
                  onChange={updateLocationField("country")}
                >
                  <option value="">Country</option>
                  {countries.map((country) => (
                    <option key={country._id} value={country._id}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
              <input type="hidden" name="eventLocationInstitution" value={eventLocation.institution} />
              <input type="hidden" name="eventLocationCity" value={eventLocation.city} />
              <input type="hidden" name="eventLocationCountry" value={eventLocation.country} />
              <span ref={institutionMeasureRef} className={styles.measureText} aria-hidden>
                {eventLocation.institution || "Institution"}
              </span>
              <span ref={cityMeasureRef} className={styles.measureText} aria-hidden>
                {eventLocation.city || "City"}
              </span>
              <span ref={countryMeasureRef} className={styles.measureText} aria-hidden>
                {selectedCountryLabel || "Country"}
              </span>
              <span ref={startDayMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(startDate.day, todayDateParts.day)}
              </span>
              <span ref={startMonthMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(startDate.month, todayDateParts.month)}
              </span>
              <span ref={startYearMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(startDate.year, todayDateParts.year)}
              </span>
              <span ref={endDayMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(endDate.day, tomorrowDateParts.day)}
              </span>
              <span ref={endMonthMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(endDate.month, tomorrowDateParts.month)}
              </span>
              <span ref={endYearMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(endDate.year, tomorrowDateParts.year)}
              </span>
              <span ref={openingDayMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(openingDate.day, todayDateParts.day)}
              </span>
              <span ref={openingMonthMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(openingDate.month, todayDateParts.month)}
              </span>
              <span ref={openingYearMeasureRef} className={styles.measureText} aria-hidden>
                {getMeasureText(openingDate.year, todayDateParts.year)}
              </span>
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
          </div>

          <div className={styles.upload}>
            <div className={`${styles.entry} ${styles.uploadHeader}`}>
              <p>Image</p>
              <Button
                onClick={handleUploadButtonClick}
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
                  "Select File"
                )}
              </Button>
              <div className={styles.uploadMetaRow}>
                <p className={`${styles.formTitle} ${styles.uploadMetaLabel}`}>Copyright</p>
                <div className={styles.uploadMetaFields}>
                  <input
                    className={`${styles.input} ${styles.uploadMetaInput}`}
                    type="text"
                    placeholder="Title of Work"
                    value={workTitle}
                    style={{ width: workTitleWidth ? `${workTitleWidth}px` : undefined }}
                    onChange={(event) => setWorkTitle(event.target.value)}
                  />
                  <span className={styles.uploadMetaDivider} style={{ marginRight: "4px" }}>
                    ,
                  </span>
                  <input
                    className={`${styles.input} ${styles.uploadMetaInput}`}
                    type="text"
                    placeholder="Year of Origin"
                    value={workYear}
                    onChange={(event) => setWorkYear(event.target.value)}
                  />
                </div>
              </div>
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
                setSubmitMessage("");

                let intervalId = null;
                try {
                  intervalId = window.setInterval(() => {
                    setUploadProgress((prev) => Math.min(prev + 8, 90));
                  }, 120);

                  const formData = new FormData();
                  formData.append("file", file);

                  const response = await fetch("/api/profile/upload-image", {
                    method: "POST",
                    body: formData,
                  });
                  const result = await response.json().catch(() => ({}));

                  if (!response.ok || !result?.assetId) {
                    throw new Error(result?.error || "Image upload failed.");
                  }

                  setUploadedImageAssetId(result.assetId);
                  setUploadProgress(100);
                  setUploadStatus("uploaded");
                } catch (error) {
                  setUploadedImageAssetId("");
                  setUploadStatus("idle");
                  setUploadProgress(0);
                  setSubmitStatus("error");
                  setSubmitMessage(error instanceof Error ? error.message : "Image upload failed.");
                  if (uploadInputRef.current) {
                    uploadInputRef.current.value = "";
                  }
                } finally {
                  if (intervalId) {
                    window.clearInterval(intervalId);
                  }
                }
              }}
            />

            <div className={styles.uploadBottom}>
              <div className={styles.formButtons}>
                <Button
                  className={`${styles.sendButton} ${!isFormComplete ? styles.sendButtonDisabled : ""}`}
                  disabled={!isFormComplete || uploadStatus === "uploading"}
                  type="submit"
                >
                  {submitStatus === "submitting" ? "SUBMITTING" : "SUBMIT"}
                </Button>
              </div>
              {submitMessage ? (
                <p className={`${styles.formFeedback} ${submitStatus === "error" ? styles.formFeedbackError : ""}`}>
                  {submitMessage}
                </p>
              ) : null}
            </div>
            <span ref={workTitleMeasureRef} className={styles.measureText} aria-hidden>
              {workTitle || "Title of Work"}
            </span>
          </div>
        </form>
      </section>
    </main>
  );
};

export default ProfileClient;
