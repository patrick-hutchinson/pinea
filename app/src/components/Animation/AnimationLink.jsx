import { MenuContext } from "@/context/MenuContext";
import { SearchContext } from "@/context/SearchContext";
import { LanguageContext } from "@/context/LanguageContext";
import { stripLocaleFromPathname, withLocalePathname } from "@/lib/i18n";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const AnimationLink = ({ children, path, className, onMouseEnter, onMouseLeave, typo }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const router = useTransitionRouter();
  const { setShowMenu } = useContext(MenuContext);
  const { setSearchQuery } = useContext(SearchContext);
  const { language } = useContext(LanguageContext);

  const [pathWithoutHash, hash] = path.split("#");
  const localizedPath = pathWithoutHash.startsWith("/") ? withLocalePathname(pathWithoutHash, language) : pathWithoutHash;
  const localizedPathWithHash = hash ? `${localizedPath}#${hash}` : localizedPath;

  const pageAnimation = () => {
    const duration = 800;
    const root = document.documentElement;
    root.classList.add("is-route-transitioning");

    document.documentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration,
      easing: "ease",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    });

    document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration,
      easing: "ease",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    });

    // 🔔 notify when transition is done
    setTimeout(() => {
      root.classList.remove("is-route-transitioning");
      window.dispatchEvent(new Event("view-transition-finished"));
    }, duration);
  };

  return (
    <a
      className={`${className} animation-link`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      typo={typo}
      onClick={(e) => {
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

        router.push(localizedPathWithHash, {
          onTransitionReady: pageAnimation,
        });
      }}
    >
      {children}
    </a>
  );
};

export default AnimationLink;
