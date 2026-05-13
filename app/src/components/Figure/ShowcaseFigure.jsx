import styles from "./Figure.module.css";
import React, { useContext } from "react";
import Link from "next/link";

import AnimationLink from "../Animation/AnimationLink";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import Text from "../Text/Text";
import { useRef, useState, useEffect } from "react";

import { DimensionsContext } from "@/context/DimensionsContext";
import { StateContext } from "@/context/StateContext";
import Media from "../Media/Media";

const ShowcaseFigure = ({ className, path, above, medium, below, background, offsetTop, expandMedia }) => {
  const { isMobile } = useContext(StateContext);
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const { deviceDimensions } = useContext(DimensionsContext);

  const Wrapper = path ? AnimationLink : "div";
  const wrapperProps = path ? { path } : { style: { width: "100%" } };

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    setContainerDimensions({ width: containerWidth, height: containerHeight });
  }, [deviceDimensions]);

  const renderElement = (element) => {
    if (!element) return null;

    // 1. Already a React element (<div />, <Button />, etc.)
    if (React.isValidElement(element)) {
      return element;
    }

    // 2. Sanity / rich text blocks (array or object)
    if (Array.isArray(element) || typeof element === "object") {
      return <Text text={element} />;
    }

    // 3. Plain string / number fallback
    return <Text text={element} />;
  };

  return (
    <Wrapper {...wrapperProps}>
      <figure
        className={`${className} ${styles.showcase} ${background === "transparent" && styles.light}`}
        style={{ background: background ?? "var(--foreground)" }}
        ref={containerRef}
      >
        {(above?.title || above?.subtitle) && (
          <figcaption className={`${styles.figcaption}`}>
            {above.title && (
              <Text
                className={styles.title}
                typo="h3"
                text={above.title}
                style={{ whiteSpace: "pre-line" }}
              />
            )}
            {above.subtitle && <Text text={above.subtitle} />}
          </figcaption>
        )}

        <ExpandMedia
          className={styles.showcaseImage}
          medium={medium}
          containerDimensions={containerDimensions}
          cropMultiplier={0.5}
          style={{ position: !isMobile && offsetTop && "relative", top: !isMobile && offsetTop && `${offsetTop}px` }}
          expandMedia={expandMedia}
        />

        {(below?.title || below?.subtitle) && (
          <figcaption className={`${styles.figcaption}`}>
            {below.title && renderElement(below.title)}
            {below.subtitle && renderElement(below.subtitle)}
          </figcaption>
        )}
      </figure>
    </Wrapper>
  );
};

export default ShowcaseFigure;
