import { MenuContext } from "@/context/MenuContext";
import { SearchContext } from "@/context/SearchContext";
import { LanguageContext } from "@/context/LanguageContext";
import { stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n";
import { usePathname, useRouter } from "@/context/RouteContext";
import { forwardRef, useContext } from "react";
import { runRouteTransition } from "./routeTransition";

const AnimationLink = forwardRef(({ children, path, className, onMouseEnter, onMouseLeave, typo, ...props }, ref) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const router = useRouter();
  const { setShowMenu } = useContext(MenuContext);
  const { setSearchQuery } = useContext(SearchContext);
  const { language } = useContext(LanguageContext);

  const [pathWithoutHash, hash] = path.split("#");
  const localizedPath = pathWithoutHash.startsWith("/") ? withLocalePathname(pathWithoutHash, language) : pathWithoutHash;
  const localizedPathWithHash = hash ? `${localizedPath}#${hash}` : localizedPath;

  return (
    <a
      ref={ref}
      className={`${className} animation-link`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      typo={typo}
      {...props}
      onClick={(e) => {
        props.onClick?.(e);
        if (e.defaultPrevented) return;

        e.preventDefault();

        if (basePathname === pathWithoutHash) {
          console.log("pathname is the same!");
          setShowMenu(false);
          setSearchQuery("");

          if (hash) {
            window.location.hash = hash;
          }
          return;
        }

        // SAME PATH, DIFFERENT HASH
        if (stripLocaleFromPathname(window.location.pathname) === pathWithoutHash) {
          setShowMenu(false);
          setSearchQuery("");

          if (hash) {
            window.location.hash = hash; // ✅ triggers hashchange
          }

          return;
        }

        runRouteTransition();
        router.push(localizedPathWithHash);
      }}
    >
      {children}
    </a>
  );
});

AnimationLink.displayName = "AnimationLink";

export default AnimationLink;
