import styles from "./Figure.module.css";
import React, { useContext } from "react";
import Link from "next/link";

import ExpandMedia from "@/components/ExpandMedia/ExpandMedia";
import Text from "../Text/Text";
import { useRef, useState, useEffect } from "react";

import { DimensionsContext } from "@/context/DimensionsContext";

const ShowcaseFigure = ({ className, path, above, medium, below, background }) => {
  const containerRef = useRef(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: 0, height: 0 });

  const { deviceDimensions } = useContext(DimensionsContext);

  const Wrapper = path ? Link : "div";
  const wrapperProps = path ? { href: path } : {};

  useEffect(() => {
    if (!containerRef.current) return;

    const containerWidth = containerRef.current.getBoundingClientRect().width;
    const containerHeight = containerRef.current.getBoundingClientRect().height;

    setContainerDimensions({ width: containerWidth, height: containerHeight });
  }, [deviceDimensions]);

  const renderElement = (element) => {
    if (typeof element === "string") {
      return <Text text={element} />;
    }

    // check for Portable Text block (object with _type and children)
    if (element && typeof element === "object" && "_type" in element && "children" in element) {
      return <Text text={element} />;
    }

    // Assume it's a React element
    return element;
  };

  return (
    <Wrapper {...wrapperProps}>
      <figure
        // onClick={onClick}
        className={`${className} ${styles.showcase} ${background === "transparent" && styles.light}`}
        style={{ background: background ?? "var(--foreground)" }}
        ref={containerRef}
      >
        {(above?.title || above?.subtitle) && (
          <figcaption className={`${styles.figcaption}`}>
            {above.title && <Text className={styles.title} typo="h3" text={above.title} />}
            {above.subtitle && <Text text={above.subtitle} />}
          </figcaption>
        )}

        <ExpandMedia
          className={styles.showcaseImage}
          medium={medium}
          containerDimensions={containerDimensions}
          cropMultiplier={0.5}
        />

        {(below?.title || below?.subtitle) && (
          <figcaption className={`${styles.figcaption}`}>
            {below.title && <Text typo="h3" className={styles.title} text={below.title} />}
            {below.subtitle && renderElement(below.subtitle)}
          </figcaption>
        )}
      </figure>
    </Wrapper>
  );
};

export default ShowcaseFigure;
