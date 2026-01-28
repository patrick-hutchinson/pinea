"use client";

import { useEffect, useState, useContext } from "react";

import { translate } from "@/helpers/translate";

import FormatDate from "@/components/FormatDate/FormatDate";

import FilterHeader from "@/components/FilterHeader/FilterHeader";

import styles from "./Bulletin.module.css";
import BulletinExpandable from "@/components/Bulletin/BulletinExpandable";
import { scrollToHash } from "../../helpers/scrollToHash";

import { CSSContext } from "@/context/CSSContext";

const BulletinList = ({ bulletins }) => {
  const { header_height, filter_height } = useContext(CSSContext);
  const [activeYear, setActiveYear] = useState([]);

  const sortedBulletins = [...bulletins].sort((a, b) => {
    return new Date(a.deadline) - new Date(b.deadline);
  });

  // Find all available years
  const years = Array.from(new Set(bulletins.map((item) => new Date(item.deadline).getFullYear().toString()))).sort();

  const handleFilter = (filter) => {
    setActiveYear(filter);
  };

  const filteredBulletins = sortedBulletins.filter((bulletin) => {
    // if no filters selected → show all
    if (activeYear.length === 0) return true;

    const year = new Date(bulletin.deadline).getFullYear().toString();
    return activeYear.includes(year);
  });

  useEffect(() => {
    scrollToHash(-(header_height + filter_height));
  }, []);

  return (
    <>
      <FilterHeader
        className={styles.filter_header}
        array={years}
        handleFilter={handleFilter}
        currentlyActive={activeYear}
      />
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
    </>
  );
};

export default BulletinList;
