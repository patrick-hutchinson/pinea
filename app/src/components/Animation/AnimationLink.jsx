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
        e.preventDefault();

        router.push(path, {
          onTransitionReady: pageAnimation,
        });
      }}
      // href={path}
      // target={external ? "_blank" : ""}
    >
      {children}
    </a>
  );
};

export default AnimationLink;
