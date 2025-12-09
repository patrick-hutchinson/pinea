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
    <a className={styles.newsletter}>
      <div onClick={() => handleClick()}>
        {language === "en" ? "Subscribe to Our Newsletter" : "Newsletter abonnieren"}
      </div>
    </a>
  );
};

export default NewsletterSignUp;

{
  /* <form method="post" action="https://hypnotic-bulldog.pikapod.net/subscription/form" class="listmonk-form">
  <div>
    <h3>Subscribe</h3>
    <input type="hidden" name="nonce" />

    <p><input type="email" name="email" required placeholder="E-mail" /></p>
    <p><input type="text" name="name" placeholder="Name (optional)" /></p>

    <p>
      <input id="ded69" type="checkbox" name="l" checked value="ded69a55-2f0b-4407-8dd4-d2d1d910dcf6" />
      <label for="ded69">Testing</label>
      <br />
      <span>List used to test email campaignes</span>
    </p>

    <input type="submit" value="Subscribe " />
  </div>
</form> */
}
