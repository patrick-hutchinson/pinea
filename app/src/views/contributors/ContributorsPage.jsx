"use client";

import styles from "./ContributorsPage.module.css";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { useEffect, useMemo, useRef, useState } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { PlainHead } from "@/components/Calendar/Head";
import { useContext } from "react";

import { CSSContext } from "@/context/CSSContext";
import { useLenisContext } from "@/context/LenisContext";
import { useRouter } from "@/context/RouteContext";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";

import Contributor from "./Contributor";

const ContributorsPage = ({ contributors }) => {
  const [selectedLetter, setSelectedLetter] = useState();
  const [activeLetter, setActiveLetter] = useState("D"); // <-- NEW
  const activeLetterRef = useRef("D");
  const { header_height, filter_height } = useContext(CSSContext);
  const lenis = useLenisContext();
  const router = useRouter();

  const { language } = useContext(LanguageContext);
  const scrollToTop = (top) => {
    if (lenis) {
      lenis.scrollTo(top, { duration: 0.6 });
      return;
    }

    // Firefox can end at the wrong offset during smooth scrolling.
    window.scrollTo({ top, behavior: "auto" });
    requestAnimationFrame(() => {
      window.scrollTo({ top, behavior: "smooth" });
    });
  };

  const array = useMemo(() => {
    return [
      ...new Set(
        contributors.map((c) => {
          const parts = c.name.trim().split(" ");
          const lastName = parts[parts.length - 1];
          return lastName.charAt(0).toUpperCase();
        }),
      ),
    ].sort();
  }, [contributors]);

  const handleFilter = (item) => {
    setSelectedLetter((prev) => (prev === item ? null : item));
    if (selectedLetter === item) {
      // Force effect to re-run by re-setting it
      setTimeout(() => setSelectedLetter(item), 0);
    }
  };

  useEffect(() => {
    if (selectedLetter) {
      const el = document.querySelector(`.contributor-${selectedLetter}`);

      if (el) {
        const firstContributor = document.querySelector(`.${styles.list} > .${styles.contributor_wrapper}:first-child`);
        const isFirstAnchor = el === firstContributor;
        const firstAnchorCorrection = isFirstAnchor ? 50 : 0;
        const offset = filter_height + header_height + firstAnchorCorrection;
        const top = el.getBoundingClientRect().top + window.scrollY - offset;
        scrollToTop(top);
      }
    }
  }, [selectedLetter, filter_height, header_height, lenis]);

  useEffect(() => {
    let frame = null;

    const updateActiveLetter = () => {
      const rows = Array.from(document.querySelectorAll(`.${styles.list} > .${styles.contributor_wrapper}`));
      if (rows.length === 0) return;

      const anchorY = header_height + filter_height + 1;
      let nextLetter = rows[0]?.dataset?.contributorInitial || activeLetterRef.current;

      for (const row of rows) {
        if (row.getBoundingClientRect().top <= anchorY) {
          nextLetter = row.dataset.contributorInitial || nextLetter;
        } else {
          break;
        }
      }

      if (activeLetterRef.current === nextLetter) return;

      activeLetterRef.current = nextLetter;
      setActiveLetter(nextLetter);

      if (window.location.hash !== `#${nextLetter}`) {
        router.replace(`#${nextLetter}`, { scroll: false });
      }
    };

    const requestUpdate = () => {
      if (frame) return;

      frame = requestAnimationFrame(() => {
        frame = null;
        updateActiveLetter();
      });
    };

    updateActiveLetter();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, [filter_height, header_height, router]);

  const sortedContributors = useMemo(() => {
    return [...contributors].sort((a, b) => {
      const lastA = a.name.trim().split(" ").slice(-1)[0].toUpperCase();
      const lastB = b.name.trim().split(" ").slice(-1)[0].toUpperCase();
      return lastA.localeCompare(lastB);
    });
  }, [contributors]);

  return (
    <main className={styles.main}>
      <FilterHeader currentlyActive={activeLetter} array={array} handleFilter={handleFilter} activeScrollBehavior="auto" />
      <div className={styles.page_header}>
        <PlainHead>{language === "en" ? "ABOUT" : "INFO"}</PlainHead>
        <PlainHead className={styles.article_head}>STORIES</PlainHead>
      </div>

      <div className={styles.list}>
        {sortedContributors.map((contributor, index) => (
          <Contributor key={index} contributor={contributor} index={index} />
        ))}
      </div>

      <SitePineaIcon />
    </main>
  );
};

export default ContributorsPage;
