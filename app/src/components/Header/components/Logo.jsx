import { useContext, useEffect, useMemo, useRef, useState } from "react";

import { usePathname } from "@/context/RouteContext";
import { motion } from "framer-motion";

import AnimationLink from "@/components/Animation/AnimationLink";

import styles from "../Header.module.css";
import { StateContext } from "@/context/StateContext";
import { stripLocaleFromPathname } from "@/lib/i18n";

const LONG_LOGO_TEXT = "Photography Intermedia Et Al.";
const SHORT_LOGO_TEXT = "P.IN.E.A";
const LOGO_KEEPERS = {
  0: "P",
  12: "I",
  13: "N",
  23: "E",
  26: "A",
};
const SHORT_DOTS = {
  0: true,
  13: true,
  23: true,
};
const LOGO_FONT_SIZE = 100;
const LOGO_FONT_FAMILY = "HBMarginS";
const LOGO_FONT_WEIGHT = 375;
const LOGO_LETTER_SPACING = 1.875;

const getShortCharacter = (index, fallbackCharacter = "") => LOGO_KEEPERS[index] || fallbackCharacter;

const getShortGlyphPositions = (longGlyphs, dotGlyph, shortGlyphWidths = {}) => {
  const targetByCharacter = {};
  const positions = {};
  const widths = {};
  let x = 0;

  ["P", ".", "I", "N", ".", "E", ".", "A"].forEach((character) => {
    if (!targetByCharacter[character]) targetByCharacter[character] = [];
    targetByCharacter[character].push(x);

    const sourceGlyph = longGlyphs.find((glyph) => getShortCharacter(glyph.index, glyph.character) === character);
    const width = character === "." ? dotGlyph?.advanceWidth || 18 : shortGlyphWidths[character] || sourceGlyph?.advanceWidth || 58;

    x += width + LOGO_LETTER_SPACING;
  });

  Object.entries(LOGO_KEEPERS).forEach(([index, character]) => {
    positions[index] = targetByCharacter[character]?.shift() || 0;
    widths[index] = shortGlyphWidths[character] || longGlyphs[Number(index)]?.advanceWidth || 58;
  });

  return {
    positions,
    widths,
    width: x - LOGO_LETTER_SPACING,
  };
};

const useLogoSVGData = () => {
  const [logoData, setLogoData] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const buildLogoData = async () => {
      if (document?.fonts?.load) {
        await document.fonts.load(`${LOGO_FONT_WEIGHT} ${LOGO_FONT_SIZE}px ${LOGO_FONT_FAMILY}`);
      }

      if (document?.fonts?.ready) {
        await document.fonts.ready;
      }

      if (!isMounted) return;

      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      if (!context) return;

      context.font = `${LOGO_FONT_WEIGHT} ${LOGO_FONT_SIZE}px ${LOGO_FONT_FAMILY}`;

      let x = 0;
      const glyphs = LONG_LOGO_TEXT.split("").map((character, index) => {
        const advanceWidth = context.measureText(character).width;
        const glyph = {
          advanceWidth,
          character,
          index,
          x,
        };

        x += advanceWidth + LOGO_LETTER_SPACING;
        return glyph;
      });
      const dotGlyph = {
        advanceWidth: context.measureText(".").width,
        character: ".",
      };
      const shortGlyphWidths = Object.values(LOGO_KEEPERS).reduce(
        (widths, character) => ({
          ...widths,
          [character]: context.measureText(character).width,
        }),
        {},
      );
      const { positions, width, widths } = getShortGlyphPositions(glyphs, dotGlyph, shortGlyphWidths);

      setLogoData({
        dotGlyph,
        glyphs,
        longWidth: x - LOGO_LETTER_SPACING,
        metricHeight: 116,
        shortGlyphPositions: positions,
        shortGlyphWidths: widths,
        shortWidth: width,
        isReady: true,
        viewBox: `0 -90 ${x - LOGO_LETTER_SPACING} 116`,
      });
    };

    buildLogoData().catch((error) => {
      if (process.env.NODE_ENV !== "production") {
        console.warn("Logo SVG text could not measure font metrics:", error);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return logoData;
};

const AnimatedLogoText = ({ text }) => {
  const isShort = text === SHORT_LOGO_TEXT;
  const ease = [0.65, 0, 0.35, 1];
  const spatialDelay = isShort ? 0.12 : 0;
  const revealDelay = isShort ? 0 : 0.12;
  const transition = {
    width: { duration: 0.62, ease, delay: spatialDelay },
  };
  const glyphTransition = {
    opacity: { duration: 0.26, ease, delay: revealDelay },
    x: { duration: 0.62, ease, delay: spatialDelay },
  };
  const dotTransition = {
    opacity: { duration: 0.24, ease, delay: isShort ? 0.18 : 0 },
    x: { duration: 0.62, ease, delay: spatialDelay },
  };
  const logoData = useLogoSVGData();
  const isReady = Boolean(logoData?.isReady);

  if (!isReady) {
    return <span aria-label={text} className={`${styles.logoAnimation} ${styles.logoAnimationPending}`} typo="h3" />;
  }

  const longWidth = logoData.longWidth / LOGO_FONT_SIZE;
  const shortWidth = logoData.shortWidth / LOGO_FONT_SIZE;
  const metricHeight = logoData.metricHeight / LOGO_FONT_SIZE;

  return (
    <motion.span
      aria-label={text}
      className={styles.logoAnimation}
      initial={false}
      animate={{
        opacity: 1,
        width: `${isShort ? shortWidth : longWidth}em`,
      }}
      transition={{
        opacity: { duration: 0.35, ease: "easeOut" },
        ...transition,
      }}
      typo="h3"
    >
      <svg
        aria-hidden="true"
        className={styles.logoSvgText}
        focusable="false"
        preserveAspectRatio="xMinYMin meet"
        role="img"
        style={{
          height: `${metricHeight}em`,
          width: `${longWidth}em`,
        }}
        viewBox={logoData.viewBox}
      >
        {logoData.glyphs.map((glyph) => {
          const shouldKeep = Boolean(LOGO_KEEPERS[glyph.index]);
          const visibleCharacter = isShort && shouldKeep ? getShortCharacter(glyph.index, glyph.character) : glyph.character;
          const targetX = logoData.shortGlyphPositions[glyph.index] ?? glyph.x;
          const translateX = targetX - glyph.x;

          return (
            <motion.text
              key={`logo-glyph-${glyph.index}`}
              initial={false}
              animate={{
                opacity: isShort ? (shouldKeep ? 1 : 0) : 1,
                x: isShort && shouldKeep ? translateX : 0,
              }}
              dominantBaseline="alphabetic"
              fontFamily={LOGO_FONT_FAMILY}
              fontSize={LOGO_FONT_SIZE}
              fontWeight={LOGO_FONT_WEIGHT}
              transition={glyphTransition}
              x={glyph.x}
              y="0"
            >
              {visibleCharacter}
            </motion.text>
          );
        })}
        {logoData.dotGlyph
          ? Object.keys(SHORT_DOTS).map((afterIndex) => {
              const targetX = logoData.shortGlyphPositions[afterIndex];
              const keeperGlyph = logoData.glyphs[Number(afterIndex)];
              const keeperWidth = logoData.shortGlyphWidths?.[afterIndex] || keeperGlyph?.advanceWidth || 0;
              const dotX = targetX + keeperWidth + LOGO_LETTER_SPACING;

              return (
                <motion.text
                  key={`logo-dot-${afterIndex}`}
                  initial={false}
                  animate={{
                    opacity: isShort ? 1 : 0,
                    x: isShort ? dotX : keeperGlyph?.x || 0,
                  }}
                  dominantBaseline="alphabetic"
                  fontFamily={LOGO_FONT_FAMILY}
                  fontSize={LOGO_FONT_SIZE}
                  fontWeight={LOGO_FONT_WEIGHT}
                  transition={dotTransition}
                  x="0"
                  y="0"
                >
                  .
                </motion.text>
              );
            })
          : null}
      </svg>
    </motion.span>
  );
};

const Logo = ({ showMenu, showSearch }) => {
  const pathname = usePathname();
  const basePathname = stripLocaleFromPathname(pathname || "/");
  const { isMobile, isTablet } = useContext(StateContext);
  const [isLogoCollapsed, setIsLogoCollapsed] = useState(false);
  const [showLongAfterSearchFade, setShowLongAfterSearchFade] = useState(!showSearch);
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const isHome = basePathname === "/";
  const previousPathnameRef = useRef(pathname);
  const previousScrollRef = useRef(0);

  useEffect(() => {
    if (showSearch) {
      setShowLongAfterSearchFade(false);
      return;
    }

    const timeout = setTimeout(() => {
      setShowLongAfterSearchFade(true);
    }, 500);

    return () => clearTimeout(timeout);
  }, [showSearch]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    previousScrollRef.current = window.scrollY || document.documentElement.scrollTop || 0;

    const handleScroll = () => {
      if (isRouteTransitioning) return;

      const currentScroll = Math.max(0, window.scrollY || document.documentElement.scrollTop || 0);
      const delta = currentScroll - previousScrollRef.current;

      previousScrollRef.current = currentScroll;

      if (currentScroll <= 2) {
        setIsLogoCollapsed(false);
        return;
      }

      if (Math.abs(delta) < 3) return;

      setIsLogoCollapsed(delta > 0);
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isRouteTransitioning]);

  useEffect(() => {
    const handleTransitionStart = () => setIsRouteTransitioning(true);
    const handleTransitionComplete = () => setIsRouteTransitioning(false);

    window.addEventListener("pinea-page-transition-start", handleTransitionStart);
    window.addEventListener("pinea-page-transition-complete", handleTransitionComplete);

    return () => {
      window.removeEventListener("pinea-page-transition-start", handleTransitionStart);
      window.removeEventListener("pinea-page-transition-complete", handleTransitionComplete);
    };
  }, []);

  useEffect(() => {
    if (previousPathnameRef.current === pathname) return;

    setIsRouteTransitioning(true);
    previousPathnameRef.current = pathname;
  }, [pathname]);

  useEffect(() => {
    if (!isRouteTransitioning) return undefined;

    const timeout = setTimeout(() => setIsRouteTransitioning(false), 900);
    return () => clearTimeout(timeout);
  }, [isRouteTransitioning]);

  const preferredLogoText = useMemo(() => {
    const useStaticLogo = isMobile === true || isTablet === true;

    if (useStaticLogo) {
      return showMenu || !(isHome && showLongAfterSearchFade) ? "P.IN.E.A" : "Photography Intermedia Et Al.";
    }

    return isLogoCollapsed ? "P.IN.E.A" : "Photography Intermedia Et Al.";
  }, [isMobile, isTablet, showMenu, isHome, showLongAfterSearchFade, isLogoCollapsed]);

  const [logoText, setLogoText] = useState(preferredLogoText);

  useEffect(() => {
    if (isRouteTransitioning) return;
    setLogoText(preferredLogoText);
  }, [preferredLogoText, isRouteTransitioning]);

  return (
    <AnimationLink className={styles.logo} path="/">
      <AnimatedLogoText text={logoText} />
    </AnimationLink>
  );
};

export default Logo;
