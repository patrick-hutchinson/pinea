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
    <a className={styles.newsletter} href="http://eepurl.com/juH9tk" target="_blank">
      {/* <div onClick={() => handleClick()}> */}
      {language === "en" ? "Subscribe to Our Newsletter" : "Newsletter abonnieren"}
      {/* </div> */}
    </a>
  );
};

export default NewsletterSignUp;

{
  /* <form method="post" action="https://hypnotic-bulldog.pikapod.net/subscription/form" class="listmonk-form">
  <div>
    <h3>Subscribe</h3>
    <input type="hidden" name="nonce" />

    <p>
      <input type="email" name="email" required placeholder="E-mail" />
    </p>
    <p>
      <input type="text" name="name" placeholder="Name (optional)" />
    </p>

    <p>
      <input id="e6f51" type="checkbox" name="l" checked value="e6f51499-9cbc-4055-be06-25a30ad02198" />
      <label for="e6f51">P.IN.E.A Subscribers (DE)</label>
      <br />
      <span>Die komplette Liste der Abonnenten des deutschen P.IN.E.A Newsletters</span>
    </p>
    <p>
      <input id="9513b" type="checkbox" name="l" checked value="9513bb5b-6eaa-481c-936b-bf9e475ae0f6" />
      <label for="9513b">P.IN.E.A Subscribers (EN)</label>
      <br />
      <span>Die komplette Liste der Abonnenten des englischen P.IN.E.A Newsletters</span>
    </p>

    <input type="submit" value="Subscribe " />
  </div>
</form>; */
}
