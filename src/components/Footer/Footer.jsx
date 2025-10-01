import Text from "@/components/Text";
import Link from "next/link";

import styles from "./Footer.module.css";

const Footer = ({ siteData }) => {
  const NewsletterSignUp = () => (
    <div className={styles.newsletter}>
      <p>Stay Up to Date</p>
      <input type="email" name="email" placeholder="Subscribe to our Newsletter" autoComplete="email" required />
    </div>
  );

  const Credits = () => (
    <div className={styles.credits}>
      <h3>{siteData.title}</h3>
      <div className={styles.contact}>
        <Link href="/contact"> Contact </Link>
        <ul>
          {siteData.socials.map((social, index) => (
            <li key={index}>
              <a href={social.link ? social.link : "#"} target="_blank">
                {social.platform}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <ul>
        {siteData.supporters.map((service, index, array) => (
          <li key={index}>{service}</li>
        ))}
      </ul>
    </div>
  );

  return (
    <footer id={styles.footer}>
      <Text text={siteData.about} />
      <NewsletterSignUp />
      <Credits />
    </footer>
  );
};

export default Footer;
