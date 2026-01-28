import AnimationLink from "@/components/Animation/AnimationLink";
import styles from "../Header.module.css";

const Navigation = ({ onLinkClick }) => {
  return (
    <nav className={styles.nav} style={{ userSelect: "none" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li>
          <AnimationLink path="/stories" onClick={onLinkClick}>
            Stories
          </AnimationLink>
        </li>

        <li>
          <AnimationLink path="/contributors" onClick={onLinkClick}>
            Contributors
          </AnimationLink>
        </li>
        <li>
          <AnimationLink path="/open-calls" onClick={onLinkClick}>
            Open Calls
          </AnimationLink>
        </li>
        <li>
          <AnimationLink path="/news" onClick={onLinkClick}>
            News
          </AnimationLink>
        </li>
        <li>
          <AnimationLink path="/calendar" onClick={onLinkClick}>
            Calendar
          </AnimationLink>
        </li>
        <li>
          <AnimationLink path="/index" onClick={onLinkClick}>
            Index
          </AnimationLink>
        </li>
      </ul>

      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li className="not-allowed">Print Periodical</li>
        {/* <li className="not-allowed">Podcast</li> */}
        <li className="not-allowed">Editions</li>
        <li>
          <AnimationLink path="/memberships" onClick={onLinkClick}>
            Memberships
          </AnimationLink>
        </li>
        <li>
          <AnimationLink path="/about" onClick={onLinkClick}>
            About
          </AnimationLink>
        </li>
        <li style={{ top: "calc(var(--line-height-3) + 3px)", position: "relative" }} className="not-allowed">
          Shop
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
