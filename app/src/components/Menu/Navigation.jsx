import AnimationLink from "@/components/Animation/AnimationLink";
import styles from "./Menu.module.css";
import { MenuContext } from "@/context/MenuContext";
import { useContext } from "react";
import { usePathname } from "@/context/RouteContext";
import { stripLocaleFromPathname } from "@/lib/i18n";

const Navigation = ({ shopEnabled = false }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const { setShowMenu } = useContext(MenuContext);

  const isActivePath = (path) => basePathname === path || basePathname.startsWith(path + "/");
  const navItemClassName = (path) => (isActivePath(path) ? styles.activeNavItem : undefined);

  const NavItem = ({ path, children, className, style }) => (
    <li className={[navItemClassName(path), className].filter(Boolean).join(" ") || undefined} style={style}>
      <AnimationLink path={path}>{children}</AnimationLink>
    </li>
  );

  return (
    <nav className={styles.nav} style={{ userSelect: "none" }}>
      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <NavItem path="/stories">Stories</NavItem>

        <NavItem path="/contributors">Contributors</NavItem>
        <NavItem path="/open-calls">Open Calls</NavItem>
        <NavItem path="/news">News</NavItem>
        <NavItem path="/calendar">Calendar</NavItem>
        <NavItem path="/archive">Archive</NavItem>
      </ul>

      <ul style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
        <NavItem path="/print-periodical">Print Periodical</NavItem>

        <NavItem path="/editions">Editions</NavItem>
        <NavItem path="/memberships">Memberships</NavItem>
        <NavItem path="/about">About</NavItem>
        {/* <li>
          <AnimationLink path="/pinea-events">P.IN.E.A Events</AnimationLink>
        </li> */}
        <li
          className={[shopEnabled ? navItemClassName("/shop") : "not-allowed"].filter(Boolean).join(" ") || undefined}
          style={{ top: "calc(var(--line-height-3) + 3px)", position: "relative" }}
        >
          {shopEnabled ? <AnimationLink path="/shop">Shop</AnimationLink> : "Shop"}
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;
