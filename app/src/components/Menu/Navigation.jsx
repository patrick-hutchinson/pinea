import AnimationLink from "@/components/Animation/AnimationLink";
import styles from "./Menu.module.css";
import { MenuContext } from "@/context/MenuContext";
import { useContext } from "react";
import { LanguageContext } from "@/context/LanguageContext";
import { usePathname } from "next/navigation";

const Navigation = () => {
  const pathname = usePathname();
  const { setShowMenu } = useContext(MenuContext);

  const handleNavigation = (path) => {
    if (pathname === path || pathname.startsWith(path + "/")) {
      setShowMenu(false);
    }
  };
  return (
    <nav className={styles.nav} style={{ userSelect: "none" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li>
          <AnimationLink path="/stories">Stories</AnimationLink>
        </li>

        <li>
          <AnimationLink path="/contributors">Contributors</AnimationLink>
        </li>
        <li>
          <AnimationLink path="/open-calls">Open Calls</AnimationLink>
        </li>
        <li>
          <AnimationLink path="/news">News</AnimationLink>
        </li>
        <li>
          <AnimationLink path="/calendar">Calendar</AnimationLink>
        </li>
        <li>
          <AnimationLink path="/archive">Archive</AnimationLink>
        </li>
      </ul>

      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <li>
          <AnimationLink path="/periodical">Print Periodical</AnimationLink>
        </li>

        <li className="not-allowed">Editions</li>
        <li>
          <AnimationLink path="/memberships">Memberships</AnimationLink>
        </li>
        <li>
          <AnimationLink path="/about">About</AnimationLink>
        </li>
        <li style={{ top: "calc(var(--line-height-3) + 3px)", position: "relative" }} className="not-allowed">
          Shop
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
