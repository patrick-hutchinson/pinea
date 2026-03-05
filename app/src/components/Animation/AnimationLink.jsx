import { MenuContext } from "@/context/MenuContext";
import { SearchContext } from "@/context/SearchContext";
import { useTransitionRouter } from "next-view-transitions";
import { usePathname } from "next/navigation";
import { useContext } from "react";

const AnimationLink = ({ children, path, className, onMouseEnter, onMouseLeave }) => {
  const pathname = usePathname();
  const router = useTransitionRouter();
  const { setShowMenu } = useContext(MenuContext);
  const { setSearchQuery } = useContext(SearchContext);

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
      onClick={(e) => {
        e.preventDefault();

        if (pathname === path) {
          console.log("pathname is the same!");
          setShowMenu(false);
          setSearchQuery("");
          return;
        }

        // SAME PATH, DIFFERENT HASH
        if (window.location.pathname === path.split("#")[0]) {
          const hash = path.split("#")[1];

          setShowMenu(false);
          setSearchQuery("");

          if (hash) {
            window.location.hash = hash; // ✅ triggers hashchange
          }

          return;
        }

        router.push(path, {
          onTransitionReady: pageAnimation,
        });
      }}
    >
      {children}
    </a>
  );
};

export default AnimationLink;
