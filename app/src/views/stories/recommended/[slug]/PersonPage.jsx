"use client";

import { useState, useEffect, useRef } from "react";

import { useScrollToHash } from "@/helpers/scrollToHash";
import { useLenisContext } from "@/context/LenisContext";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import FadePresence from "@/components/Animation/FadePresence";

import Media from "@/components/Media/Media";
import MediaPair from "@/components/MediaPair/MediaPair";

import Recommendation from "@/components/People/Recommendation";
import CurrentEvent from "@/components/People/CurrentEvent";
import Text from "@/components/Text/Text";
import PersonInfo from "@/components/People/PersonInfo";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import CopyrightHover from "@/components/CopyrightHover/CopyrightHover";

import styles from "./PersonPage.module.css";
import Label from "@/components/Label/Label";

import { translate } from "@/helpers/translate";

const PersonPage = ({ people, person }) => {
  const lenis = useLenisContext();
  const recommendations = person?.recommendations;

  const [currentEvent, setCurrentEvent] = useState(recommendations && recommendations[0]?.event);

  const names = people
    .filter((entry) => entry?.name && entry?.slug?.current)
    .map((entry) => ({
      label: entry.name,
      href: `/stories/recommended/${entry.slug.current}`,
    }));

  const infoRef = useRef(null);
  const recommendationsRef = useRef(null);
  const currentEventRef = useRef(null);
  const lastCurrentEventRect = useRef(null);
  const isSnapping = useRef(false);
  const touchStartY = useRef(null);

  const [hideCurrentEvent, setHideCurrentEvent] = useState(false);

  useScrollToHash(-75, []);

  useEffect(() => {
    const getHeaderOffset = () => {
      const rootStyle = window.getComputedStyle(document.documentElement);
      const headerHeight = parseFloat(rootStyle.getPropertyValue("--header-height")) || 0;
      const filterHeight = parseFloat(rootStyle.getPropertyValue("--filter-height")) || 0;

      return headerHeight + filterHeight;
    };

    const getVisibleViewportHeight = () => window.visualViewport?.height || window.innerHeight;

    const getViewportCenter = () => {
      const headerOffset = getHeaderOffset();
      const viewportHeight = getVisibleViewportHeight();

      return headerOffset + (viewportHeight - headerOffset) / 2;
    };

    const shouldIncludeInfoPanel = () => window.matchMedia("(min-width: 1280px)").matches;
    const isMobileViewport = () => window.matchMedia("(max-width: 1279px)").matches;

    const getSnapTargets = () => {
      const recommendationItems = recommendationsRef.current
        ? Array.from(recommendationsRef.current.querySelectorAll("li"))
        : [];
      const targets = [...recommendationItems];

      if (shouldIncludeInfoPanel() && infoRef.current) {
        targets.push(infoRef.current);
      }

      return targets;
    };

    const getSnapContext = () => {
      const targets = getSnapTargets();
      if (targets.length === 0) return null;

      const firstRect = targets[0].getBoundingClientRect();
      const lastRect = targets[targets.length - 1].getBoundingClientRect();
      const snapAreaRect = {
        top: firstRect.top,
        bottom: lastRect.bottom,
      };
      const viewportCenter = getViewportCenter();

      const closestIndex = targets.reduce((closest, target, index) => {
        const targetRect = target.getBoundingClientRect();
        const targetCenter = targetRect.top + targetRect.height / 2;
        const targetDistance = Math.abs(targetCenter - viewportCenter);

        if (!closest || targetDistance < closest.distance) {
          return { index, distance: targetDistance };
        }

        return closest;
      }, null)?.index;

      return { closestIndex, targets, snapAreaRect, viewportCenter };
    };

    const snapToIndex = (index, context) => {
      const { targets } = context;
      const target = targets[index];
      if (!target) return;

      const targetRect = target.getBoundingClientRect();
      const targetCenter = targetRect.top + targetRect.height / 2;
      const targetTop = window.scrollY + targetCenter - getViewportCenter();
      const duration = isMobileViewport() ? 0.65 : 1.3;
      isSnapping.current = true;

      if (lenis?.scrollTo) {
        lenis.scrollTo(targetTop, { duration });
      } else {
        window.scrollTo({ top: targetTop, behavior: "smooth" });
      }

      window.setTimeout(() => {
        isSnapping.current = false;
      }, duration * 1200);
    };

    const snapByDirection = (direction) => {
      if (!direction) return false;
      const context = getSnapContext();
      if (!context) return false;

      const { closestIndex, targets, snapAreaRect, viewportCenter } = context;
      const isBeforeSnapArea = viewportCenter < snapAreaRect.top;
      const isAfterSnapArea = viewportCenter > snapAreaRect.bottom;

      if (isBeforeSnapArea) {
        if (direction < 0) return false;
        snapToIndex(0, context);
        return true;
      }

      if (isAfterSnapArea) {
        if (direction > 0) return false;
        snapToIndex(targets.length - 1, context);
        return true;
      }

      const targetIndex = closestIndex + direction;
      if (targetIndex < 0 || targetIndex >= targets.length) return false;

      snapToIndex(targetIndex, context);
      return true;
    };

    const consumeScrollGesture = (event) => {
      event.preventDefault();
      event.stopPropagation();
      event.stopImmediatePropagation?.();
    };

    const handleWheel = (event) => {
      const direction = Math.sign(event.deltaY);
      if (!direction) return;

      if (isSnapping.current) {
        consumeScrollGesture(event);
        return;
      }

      if (snapByDirection(direction)) {
        consumeScrollGesture(event);
      }
    };

    const handleKeyDown = (event) => {
      const nextKeys = ["ArrowDown", "PageDown", " "];
      const previousKeys = ["ArrowUp", "PageUp"];
      const direction = nextKeys.includes(event.key) ? 1 : previousKeys.includes(event.key) ? -1 : 0;
      if (!direction) return;

      if (isSnapping.current) {
        event.preventDefault();
        return;
      }

      if (snapByDirection(direction)) {
        event.preventDefault();
      }
    };

    const handleTouchStart = (event) => {
      touchStartY.current = event.touches[0]?.clientY ?? null;
    };

    const handleTouchEnd = (event) => {
      if (touchStartY.current === null) return;
      const endY = event.changedTouches[0]?.clientY;
      if (typeof endY !== "number") return;

      const delta = touchStartY.current - endY;
      touchStartY.current = null;
      if (Math.abs(delta) < 30) return;

      if (snapByDirection(Math.sign(delta))) {
        event.preventDefault();
      }
    };

    window.addEventListener("wheel", handleWheel, { passive: false, capture: true });
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd, { passive: false });

    return () => {
      window.removeEventListener("wheel", handleWheel, { capture: true });
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [lenis]);

  useEffect(() => {
    const updateCurrentEventVisibility = () => {
      const infoRect = infoRef.current?.getBoundingClientRect();
      if (!infoRect) return;

      const currentEventRect = currentEventRef.current?.getBoundingClientRect();
      if (currentEventRect) {
        lastCurrentEventRect.current = currentEventRect;
      }

      const measuredEventRect = currentEventRect || lastCurrentEventRect.current;
      if (!measuredEventRect) return;

      const gapToPersonInfo = infoRect.top - measuredEventRect.bottom;
      setHideCurrentEvent(gapToPersonInfo <= 50);
    };

    updateCurrentEventVisibility();
    window.addEventListener("scroll", updateCurrentEventVisibility, { passive: true });
    window.addEventListener("resize", updateCurrentEventVisibility);

    return () => {
      window.removeEventListener("scroll", updateCurrentEventVisibility);
      window.removeEventListener("resize", updateCurrentEventVisibility);
    };
  }, [currentEvent]);
  const portraitMedium = person?.portrait?.medium;
  const portraitCopyright = portraitMedium?.copyrightInternational;

  return (
    <main className={styles.main}>
      <FilterHeader array={names} currentlyActive={person?.name} className={styles.filter_header} />

      <MediaPair>
        <div>
          {/* <hr className={styles.divider} /> */}
          <div className={styles.text_column}>
            <ul ref={recommendationsRef}>
              {person?.recommendations?.map((rec) => (
                <Recommendation key={rec._id} recommendation={rec} setCurrentEvent={setCurrentEvent} />
              ))}
            </ul>
            <br />
            {portraitMedium ? (
              <ExpandMedia
                className={styles.portrait_mobile}
                medium={portraitMedium}
                copyright={<Text text={translate(portraitCopyright)} />}
              />
            ) : null}
            <div ref={infoRef} className={styles.info_snap_panel}>
              <PersonInfo className={styles.info_container} person={person} />
            </div>
          </div>
        </div>

        <div className={styles.portrait_desktop}>
          <Label className={styles.label}>RECOMMENDED</Label>
          {portraitMedium ? <Media medium={portraitMedium} showCrop={true} defaultUncropped={true} /> : null}
          {portraitCopyright ? <CopyrightHover copyright={translate(portraitCopyright)} /> : null}
        </div>
      </MediaPair>

      <FadePresence motionKey={currentEvent?._id || "current-event"}>
        {currentEvent && !hideCurrentEvent && <CurrentEvent ref={currentEventRef} event={currentEvent} />}
      </FadePresence>
    </main>
  );
};

export default PersonPage;
