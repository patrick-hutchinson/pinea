"use client";

import { useEffect, useState } from "react";

import NewsletterCover from "../components/NewsletterCover";
import Longcopy from "@/components/Longcopy/Longcopy";
import NewsletterFooter from "../components/NewsletterFooter";
import NewsletterHeader from "../components/NewsletterHeader";
import NewsletterIntroduction from "../components/NewsletterIntroduction";
import NewsletterShowcase from "../components/NewsletterShowcase";
import NewsletterNews from "../components/NewsletterNews";

import NewsletterAnnouncements from "../components/NewsletterAnnouncements";
import NewsletterNewsElement from "../components/NewsletterNewsElement";
import { translate } from "@/helpers/translate";

import PineaIcon from "@/components/PineaIcon/PineaIcon";

import styles from "../Newsletter.module.css";
import FormatDate from "@/components/FormatDate/FormatDate";

const NewsletterPage = ({ site, newsletter }) => {
  console.log(newsletter.announcement.url, "newsletter url");

  return (
    <div className={styles.main}>
      <div className="container body-text">
        <NewsletterHeader newsletter={newsletter} />

        <div style={{ padding: "12px" }}>
          <img
            src="https://www.pinea-periodical.com/icons/pinea_rechteck.png"
            style={{ width: "100%", height: "auto" }}
          />
          <NewsletterIntroduction text={newsletter.introduction} />
          {newsletter.showcase && <NewsletterShowcase item={newsletter.showcase} />}
          {/* {newsletter.articles && <NewsletterFeatures array={newsletter.articles} />} */}
          {/* {newsletter.portfolios && <NewsletterPortfolios />} */}
          {newsletter.news && (
            <div className="news" style={{ marginBottom: "150px" }}>
              <h3 style={{ textAlign: "center", fontWeight: "normal" }}>NEWS</h3>

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
            </div>
          )}
          {/* {newsletter.adBanner && <NewsletterAdBanner />} */}
          {newsletter.announcement && (
            <NewsletterAnnouncements url={newsletter.announcement.url} language={newsletter.language} />
          )}
        </div>
        <NewsletterFooter language={newsletter.language} site={site} />
      </div>
    </div>
  );
};

export default NewsletterPage;
