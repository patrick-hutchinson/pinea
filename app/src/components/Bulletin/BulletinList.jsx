"use client";

import { useEffect, useState, useContext } from "react";

import { translate } from "@/helpers/translate";

import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./Bulletin.module.css";
import BulletinExpandable from "@/components/Bulletin/BulletinExpandable";

import { scrollToHash } from "../../helpers/scrollToHash";

import { CSSContext } from "@/context/CSSContext";
import BlurContainer from "../BlurContainer/BlurContainer";
import PineaIcon from "../PineaIcon/PineaIcon";
import LenisProvider, { useLenisContext } from "@/context/LenisContext";

const BulletinList = ({ bulletins }) => {
  const lenis = useLenisContext();
  const { header_height_total } = useContext(CSSContext);
  const [activeYear, setActiveYear] = useState([]);

  console.log(header_height_total, "header height total");

  const sortedBulletins = [...bulletins].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  // Find all available years
  const years = Array.from(new Set(bulletins.map((item) => new Date(item.deadline).getFullYear().toString()))).sort();

  const handleFilter = (filter) => {
    setActiveYear(filter);

    // Using Lenis
    if (lenis) {
      lenis.scrollTo(0, { duration: 0.4 }); // optional duration & easing
    }
  };

  const filteredBulletins = sortedBulletins.filter((bulletin) => {
    // if no filters selected → show all
    if (activeYear.length === 0) return true;

    const year = new Date(bulletin.deadline).getFullYear().toString();
    return activeYear.includes(year);
  });

  useEffect(() => {
    scrollToHash(-header_height_total);
  }, [header_height_total]);

  return (
    <>
      <FilterHeader
        className={styles.filter_header}
        array={years}
        handleFilter={handleFilter}
        currentlyActive={activeYear}
      />
      <BlurContainer>
        <div className={styles.bulletin_container}>
          {filteredBulletins.map((bulletin, index) => {
            return (
              <BulletinExpandable
                bulletin={bulletin}
                key={index}
                className={styles.bulletin}
                id={bulletin.slug.current}
                title={translate(bulletin.title)}
                text={translate(bulletin.teaser)}
                runningText={translate(bulletin.text)}
                label={<FormatDate date={bulletin.deadline} format={{ month: "short", day: "numeric" }} />}
              />
            );
          })}
        </div>
      </BlurContainer>
      <PineaIcon className={styles.pineaIcon} />
    </>
  );
};

export default BulletinList;
