"use client";
import { useContext, useEffect, useState } from "react";

import Text from "@/components/Text/Text";
import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { translate } from "@/helpers/translate";

import { LanguageContext } from "@/context/LanguageContext";

import styles from "./ImprintPage.module.css";

const ImprintPage = ({ site }) => {
  const { language } = useContext(LanguageContext);
  const [array, setArray] = useState(["Privacy Policy & Imprint"]);

  useEffect(() => {
    setArray(language === "en" ? ["Privacy Policy & Imprint"] : ["Datenschutzerklärung & Impressum"]);
  }, [language]);

  useEffect(() => {}, [array]);
  return (
    <main className={styles.main}>
      <FilterHeader notAllowed="not-allowed" array={array} />
      <div className={styles.page_container} typo="h4">
        <div className={styles.first}>
          <Text className={styles.privacy} text={translate(site.privacy)} />
          <Text className={styles.copyright} text={translate(site.copyright)} />
        </div>
        <Text className={styles.imprint} text={translate(site.imprint)} />
      </div>
    </main>
  );
};

export default ImprintPage;
