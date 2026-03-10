"use client";

import { layoutStories } from "@/components/Stories/helpers/layoutStories";
import { renderStoryPreview } from "@/components/Stories/helpers/renderStoryPreview";

import FilterHeader from "@/components/FilterHeader/FilterHeader";
import SitePineaIcon from "@/components/PineaIcon/SitePineaIcon";
import BlurContainer from "@/components/BlurContainer/BlurContainer";

import { useScrollToHash } from "@/helpers/scrollToHash";

import { CSSContext } from "@/context/CSSContext";

import styles from "./StoriesPage.module.css";
import { useContext, useEffect, useState } from "react";

const StoriesPage = ({ data }) => {
  const { header_height, filter_height } = useContext(CSSContext);
  const [activeCategory, setActiveCategory] = useState(null);

  useScrollToHash(-(header_height + filter_height), [header_height, filter_height]);

  useEffect(() => {
    const scrollToCategoryFromHash = () => {
      if (!window.location.hash) {
        setActiveCategory(null);
        return;
      }

      const category = window.location.hash.slice(1);
      setActiveCategory(category);

      const el = document.querySelector(`.${category}`);
      if (!el) return;

      const offset = header_height + filter_height;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    };

    scrollToCategoryFromHash();
    window.addEventListener("hashchange", scrollToCategoryFromHash);
    window.addEventListener("view-transition-finished", scrollToCategoryFromHash);

    return () => {
      window.removeEventListener("hashchange", scrollToCategoryFromHash);
      window.removeEventListener("view-transition-finished", scrollToCategoryFromHash);
    };
  }, [header_height, filter_height]);

  const array = [
    { label: "Reviews", href: "/stories#reviews" },
    { label: "Visits", href: "/stories#visits" },
    { label: "Recommended", href: "/stories#recommended" },
    { label: "Portfolios", href: "/stories#portfolios" },
    { label: "Spot On", href: "/stories#spot-on" },
  ];
  const types = [...array].sort((a, b) => a.label.localeCompare(b.label, undefined, { sensitivity: "base" }));

  const layoutedStories = layoutStories(data);
  const scrollToTarget = (href) => {
    const hash = href?.split("#")?.[1];
    if (!hash) return;

    const el = document.querySelector(`.${hash}`);
    if (!el) return;

    const offset = header_height + filter_height;
    const top = el.getBoundingClientRect().top + window.scrollY - offset;

    setActiveCategory(hash);
    window.history.replaceState(null, "", `/stories#${hash}`);
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <main className={styles.main}>
      <FilterHeader
        array={types}
        currentlyActive={types.find((item) => item.href.endsWith(`#${activeCategory}`))?.label}
        scrollToTarget={scrollToTarget}
      />
      <section className={styles.opening}>
        <SitePineaIcon />
      </section>
      <BlurContainer>
        <div className={styles.container}>
          {layoutedStories?.map((figure, index) => {
            const item = figure?.item;
            const previewKey = item?._id || item?.slug?.current || `${figure?.size || "story"}-${index}`;

            return renderStoryPreview(figure, index, previewKey);
          })}
        </div>
      </BlurContainer>
    </main>
  );
};

export default StoriesPage;
