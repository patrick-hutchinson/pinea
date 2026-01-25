"use client";

import { useEffect, useState } from "react";

import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";
import NewsletterIntroduction from "../components/NewsletterRunningText";
import NewsletterShowcase from "../components/NewsletterShowcase";

import NewsletterAnnouncements from "../components/NewsletterAnnouncements";
import NewsletterNewsElement from "../components/NewsletterBulletin";
import { translate } from "@/helpers/translate";

import PineaIcon from "@/components/PineaIcon/PineaIcon";

import styles from "../Newsletter.module.css";
import FormatDate from "@/components/FormatDate/FormatDate";

import { renderNewsletter } from "../helpers/renderNewsletter";
import NewsletterPineaIcon from "../components/NewsletterPineaIcon";

const NewsletterPage = ({ site, newsletter }) => {
  console.log(newsletter, "newsletter content");

  return (
    <div className={styles.main}>
      <div className="container body-text">
        <NewsletterHeader newsletter={newsletter} />

        <div style={{ padding: "12px" }}>
          <NewsletterPineaIcon />
          {newsletter.pageBuilder.map((block) => renderNewsletter(block, newsletter.language))}

          {/* <NewsletterIntroduction text={newsletter.introduction} /> */}
          {/* {newsletter.showcase && <NewsletterShowcase item={newsletter.showcase} language={newsletter.language} />} */}
          {/* {newsletter.articles && <NewsletterFeatures array={newsletter.articles} />} */}
          {/* {newsletter.portfolios && <NewsletterPortfolios />} */}
          {/* {newsletter.news && ( */}
          {/* <div className="news" style={{ marginBottom: "150px" }}>
              <h3 style={{ textAlign: "center", fontWeight: "normal" }}>OPEN CALLS</h3>

              {newsletter.news.map((item, index) => (
                <NewsletterNewsElement
                  language={newsletter.language}
                  key={index}
                  openCall={item}
                  title={item.title}
                  text={item.teaser}
                  label={<FormatDate date={item.deadline} format={{ month: "short", day: "numeric" }} />}
                />
              ))}
            </div> */}
          {/* )} */}
          {/* {newsletter.adBanner && <NewsletterAdBanner />} */}
          {/* {newsletter.announcement && (
            <NewsletterAnnouncements url={newsletter.announcement.url} language={newsletter.language} />
          )} */}
        </div>
        <NewsletterFooter language={newsletter.language} site={site} />
      </div>
    </div>
  );
};

export default NewsletterPage;
