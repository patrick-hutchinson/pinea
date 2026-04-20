"use client";

import { useEffect, useMemo, useState, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";

import { translate } from "@/helpers/translate";

import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./Bulletin.module.css";
import BulletinExpandable from "@/components/Bulletin/BulletinExpandable";

import { CSSContext } from "@/context/CSSContext";
import BlurContainer from "../BlurContainer/BlurContainer";
import { useLenisContext } from "@/context/LenisContext";
import { useScrollToHash } from "@/helpers/scrollToHash";

const BulletinList = ({ bulletins, sortOrder = "desc", autoScrollToUpcoming = false }) => {
  const lenis = useLenisContext();
  const { header_height_total } = useContext(CSSContext);
  const [activeYear, setActiveYear] = useState([]);
  const activeYears = Array.isArray(activeYear) ? activeYear : activeYear ? [activeYear] : [];

  const toTimestamp = (value) => {
    const ts = value ? new Date(value).getTime() : NaN;
    return Number.isFinite(ts) ? ts : NaN;
  };

  const getBulletinId = (bulletin, index = 0) =>
    bulletin?.slug?.current || bulletin?._id || bulletin?._key || `bulletin-${index}`;

  const sortedBulletins = useMemo(() => {
    return [...(bulletins || [])].sort((a, b) => {
      const aTs = toTimestamp(a?.deadline);
      const bTs = toTimestamp(b?.deadline);

      if (!Number.isFinite(aTs) && !Number.isFinite(bTs)) return 0;
      if (!Number.isFinite(aTs)) return 1;
      if (!Number.isFinite(bTs)) return -1;

      return sortOrder === "asc" ? aTs - bTs : bTs - aTs;
    });
  }, [bulletins, sortOrder]);

  // Find all available years
  const years = Array.from(
    new Set(
      (bulletins || [])
        .map((item) => toTimestamp(item?.deadline))
        .filter(Number.isFinite)
        .map((ts) => new Date(ts).getFullYear().toString()),
    ),
  ).sort();

  const handleFilter = (filter) => {
    setActiveYear(filter);

    // Using Lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.4 }); // optional duration & easing
    }
  };

  const filteredBulletins = sortedBulletins.filter((bulletin) => {
    // if no filters selected → show all
    if (activeYears.length === 0) return true;

    const year = new Date(bulletin.deadline).getFullYear().toString();
    return activeYears.includes(year);
  });
  const filterKey = activeYears.length > 0 ? activeYears.join("-") : "all";

  useScrollToHash(-header_height_total, [header_height_total]);

  useEffect(() => {
    if (!autoScrollToUpcoming) return;
    if (typeof window === "undefined") return;
    if (window.location.hash) return;
    if (!Array.isArray(sortedBulletins) || sortedBulletins.length === 0) return;

    const now = Date.now();
    const upcoming = sortedBulletins
      .map((item) => ({ item, ts: toTimestamp(item?.deadline) }))
      .filter(({ ts }) => Number.isFinite(ts) && ts >= now)
      .sort((a, b) => a.ts - b.ts)[0]?.item;

    const upcomingId = getBulletinId(upcoming);
    if (!upcomingId) return;

    const run = () => {
      const el = document.getElementById(upcomingId);
      if (!el) return;

      const top = el.getBoundingClientRect().top + window.scrollY - header_height_total + 2;

      if (lenis) {
        lenis.scrollTo(top, { duration: 0.5 });
      } else {
        window.scrollTo({ top, behavior: "smooth" });
      }
    };

    const raf = requestAnimationFrame(run);
    return () => cancelAnimationFrame(raf);
  }, [autoScrollToUpcoming, sortedBulletins, header_height_total, lenis]);

  return (
    <>
      <FilterHeader
        className={styles.filter_header}
        array={years}
        handleFilter={handleFilter}
        currentlyActive={activeYears}
      />
      <BlurContainer>
        <div className={styles.bulletin_transition_wrap}>
          <AnimatePresence mode="sync" initial={false}>
            <motion.div
              key={filterKey}
              className={styles.bulletin_transition_layer}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                position: "absolute",
                inset: 0,
                width: "100%",
              }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
            >
              <div className={styles.bulletin_container}>
                {filteredBulletins.map((bulletin, index) => {
                  const bulletinId = getBulletinId(bulletin, index);

                  return (
                    <BulletinExpandable
                      bulletin={bulletin}
                      key={bulletinId}
                      className={styles.bulletin}
                      id={bulletinId}
                      isMembersOnly={Boolean(bulletin?.membersOnlyContent)}
                      isMembersOnlyLocked={Boolean(bulletin?.isMembersOnlyLocked)}
                      title={translate(bulletin.title)}
                      text={translate(bulletin.teaser)}
                      runningText={translate(bulletin.text)}
                      label={<FormatDate date={bulletin.deadline} format={{ month: "short", day: "numeric" }} />}
                    />
                  );
                })}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </BlurContainer>
    </>
  );
};

export default BulletinList;
