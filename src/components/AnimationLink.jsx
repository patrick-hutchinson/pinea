import { useTransitionRouter } from "next-view-transitions";

const AnimationLink = ({ children, path, external }) => {
  const router = useTransitionRouter();

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
      onClick={(e) => {
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
