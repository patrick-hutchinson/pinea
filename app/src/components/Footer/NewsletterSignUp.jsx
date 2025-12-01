import styles from "./Footer.module.css";
import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const NewsletterSignUp = ({ newsletter }) => {
  const { language } = useContext(LanguageContext);

  const handleClick = () => {
    const email = "office@pinea-periodical.com";
    const subject = "Subscribe to Newsletter / Newsletter-Anmeldung";

    function portableTextToPlainText(blocks = []) {
      return blocks
        .map((block) => {
          if (block._type !== "block" || !block.children) return "";
          return block.children.map((child) => child.text).join("");
        })
        .join("\n\n");
    }

    const plain = portableTextToPlainText(newsletter.email);
    const body = encodeURIComponent(plain);

    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  };

  return (
    <div className={styles.newsletter}>
      <div onClick={() => handleClick()}>
        {language === "en" ? "Subscribe to Our Newsletter" : "Newsletter abonnieren"}
      </div>
    </div>
  );
};

export default NewsletterSignUp;
