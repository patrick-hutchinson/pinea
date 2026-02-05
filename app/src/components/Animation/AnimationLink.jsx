import { MenuContext } from "@/context/MenuContext";
import { SearchContext } from "@/context/SearchContext";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const AnimationLink = ({ children, path, external, className, onMouseEnter, onMouseLeave }) => {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const { showMenu, setShowMenu } = useContext(MenuContext);
  const { searchQuery, setSearchQuery } = useContext(SearchContext);

  const pageAnimation = () => {
    document.documentElement.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 500,
      easing: "ease",
      fill: "forwards",
      pseudoElement: "::view-transition-old(root)",
    });

    document.documentElement.animate([{ opacity: 0 }, { opacity: 1 }], {
      duration: 500,
      easing: "ease",
      fill: "forwards",
      pseudoElement: "::view-transition-new(root)",
    });
  };

  return (
    <a
      className={`${className} animation-link`}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={(e) => {
        const targetPath = stripHash(path);
        const currentPath = pathname; // already hash-free

        // SAME PAGE (with or without hash)
        if (currentPath === targetPath) {
          e.preventDefault();

          // close UI
          if (showMenu) setShowMenu(false);
          if (searchQuery.length > 0) setSearchQuery("");

          // allow native anchor scroll if hash exists
          if (path.includes("#")) {
            const hash = path.split("#")[1];
            const el = document.getElementById(hash);
            el?.scrollIntoView({ behavior: "smooth" });
          }

          return;
        }

        // DIFFERENT PAGE
        e.preventDefault();
        router.push(path, {
          onTransitionReady: pageAnimation,
        });
      }}
      href={path}
      target={external ? "_blank" : ""}
    >
      {children}
    </a>
  );
};

export default AnimationLink;
