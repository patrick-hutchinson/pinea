import Link from "next/link";

import { MenuContext } from "@/context/MenuContext";
import { SearchContext } from "@/context/SearchContext";
import { LanguageContext } from "@/context/LanguageContext";
import { stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n";
import { usePathname } from "@/context/RouteContext";
import { forwardRef, useContext } from "react";

const AnimationLink = forwardRef(({ children, path, className, onMouseEnter, onMouseLeave, typo, ...props }, ref) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const { setShowMenu } = useContext(MenuContext);
  const { setSearchQuery } = useContext(SearchContext);
  const { language } = useContext(LanguageContext);

  const targetPath = typeof path === "string" && path.length > 0 ? path : "/";
  const [pathWithoutHash, hash] = targetPath.split("#");
  const localizedPath = pathWithoutHash.startsWith("/") ? withLocalePathname(pathWithoutHash, language) : pathWithoutHash;
  const localizedPathWithHash = hash ? `${localizedPath}#${hash}` : localizedPath;
  const classes = [className, "animation-link"].filter(Boolean).join(" ");

  return (
    <Link
      ref={ref}
      href={localizedPathWithHash}
      className={classes}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      typo={typo}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (e.defaultPrevented) return;

        setSearchQuery("");

        if (basePathname === pathWithoutHash) {
          setShowMenu(false);
          if (hash) {
            e.preventDefault();
            window.location.hash = hash;
          } else {
            e.preventDefault();
          }
          return;
        }

        if (stripLocaleFromPathname(window.location.pathname) === pathWithoutHash) {
          setShowMenu(false);
          if (hash) {
            e.preventDefault();
            window.location.hash = hash;
          }
        }
      }}
    >
      {children}
    </Link>
  );
});

AnimationLink.displayName = "AnimationLink";

export default AnimationLink;
