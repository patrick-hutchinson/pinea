"use client";

import Text from "@/components/Text/Text";
import FilterHeader from "@/components/FilterHeader/FilterHeader";

import { translate } from "@/helpers/translate";

import styles from "./ImprintPage.module.css";

const ImprintPage = ({ site }) => {
  const array = ["Privacy Policy & Imprint"];
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
