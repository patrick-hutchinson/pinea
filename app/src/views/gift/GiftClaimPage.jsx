"use client";

import { useState } from "react";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "./GiftClaimPage.module.css";

const FIELD_LABELS = {
  firstName: "First name",
  lastName: "Last name",
  company: "Company",
  address1: "Address",
  address2: "Address 2",
  zip: "ZIP",
  city: "City",
  country: "Country",
};

const GiftClaimPage = ({ gift, token, loginUrl, sessionEmail, error }) => {
  const [address, setAddress] = useState({
    firstName: "",
    lastName: "",
    company: "",
    address1: "",
    address2: "",
    zip: "",
    city: "",
    country: "",
  });
  const [feedback, setFeedback] = useState("");
  const [claimed, setClaimed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const updateAddress = (field) => (event) => {
    setAddress((prev) => ({ ...prev, [field]: event.target.value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setFeedback("");

    try {
      const response = await fetch("/api/gift/claim", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, deliveryAddress: address }),
      });
      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.error || "Could not claim gift.");
      }

      setClaimed(true);
    } catch (claimError) {
      setFeedback(claimError instanceof Error ? claimError.message : "Could not claim gift.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className={styles.main} typo="h3">
      <section className={styles.section}>
        <h1 className={styles.title}>Gift Membership</h1>

        {error ? <p className={styles.message}>{error}</p> : null}

        {!error && gift ? (
          <>
            <p className={styles.message}>
              You’ve received a P.IN.E.A membership gift for {gift.tier}. Please claim it with{" "}
              {gift.recipientEmail}.
            </p>

            {!sessionEmail ? (
              <a href={loginUrl} className={styles.button}>
                Sign in to claim
              </a>
            ) : null}

            {sessionEmail && sessionEmail.toLowerCase() !== gift.recipientEmail.toLowerCase() ? (
              <p className={styles.message}>
                You are signed in as {sessionEmail}. Please sign in with {gift.recipientEmail} to claim this gift.
              </p>
            ) : null}

            {sessionEmail && sessionEmail.toLowerCase() === gift.recipientEmail.toLowerCase() && !claimed ? (
              <form className={styles.form} onSubmit={handleSubmit}>
                {Object.keys(address).map((field) => (
                  <label key={field} className={styles.field}>
                    <span>{FIELD_LABELS[field]}</span>
                    <input value={address[field]} onChange={updateAddress(field)} required={!["company", "address2"].includes(field)} />
                  </label>
                ))}
                {feedback ? <p className={styles.feedback}>{feedback}</p> : null}
                <button type="submit" className={styles.button} disabled={submitting}>
                  {submitting ? "Claiming..." : "Claim Membership"}
                </button>
              </form>
            ) : null}

            {claimed ? (
              <>
                <p className={styles.message}>Your gift membership has been activated.</p>
                <AnimationLink path="/profile" className={styles.button}>
                  Go to Profile
                </AnimationLink>
              </>
            ) : null}
          </>
        ) : null}
      </section>
    </main>
  );
};

export default GiftClaimPage;
