"use client";

import { useRef, useState, useEffect } from "react";
import Media from "@/components/Media/Media";

import styles from "./PictureBrush.module.css";
import MediaCursor from "../MediaCursor";

const PictureBrush = ({ images }) => {
  const cursor = useRef(null);
  const [hasClicked, setHasClicked] = useState(false);

  const container = useRef(null);
  const canvas = useRef(null);

  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const [imageIndex, setImageIndex] = useState(0);

  const [showCursor, setShowCursor] = useState(true);

  const sample = 50; // how many samples to interpolate between moves
  const imgRef = useRef(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 200, height: 300 });

  const mediaRef = useRef(null);

  useEffect(() => {
    if (images.length > 0) {
      const img = new Image();
      img.src = images[imageIndex].url;

      img.onload = () => {
        imgRef.current = img;

        const randomWidth = Math.random() * (200 - 80) + 80;
        const height = randomWidth / images[imageIndex].aspectRatio;

        setImageDimensions({ width: randomWidth, height });
      };
    }
  }, [images, imageIndex]);

  useEffect(() => {
    if (images.length > 0) {
      const img = new Image();
      img.src = images[imageIndex].url;

      img.onload = () => {
        imgRef.current = img;
      };
    }
  }, [images, imageIndex]);

  // Handle Window Resize
  useEffect(() => {
    const updateSize = () => {
      setCanvasSize({ w: container.current.clientWidth, h: container.current.clientHeight });
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setHasClicked(true);

    const ctx = canvas.current.getContext("2d");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    setMouse((prev) => ({ ...prev, prevX: x, prevY: y, x, y }));
    setIsDragging(true);

    if (imgRef.current) {
      ctx.drawImage(
        imgRef.current,
        x - imageDimensions.width / 2,
        y - imageDimensions.height / 2,
        imageDimensions.width,
        imageDimensions.height
      );
    }
  };

  const handleMouseMove = (e) => {
    mediaRef.current?.handleMouseMove(e);

    if (!isDragging || !imgRef.current) return;
    e.preventDefault();

    const ctx = canvas.current.getContext("2d");

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    const { x: prevX, y: prevY } = mouse;
    const dx = (x - prevX) / sample;
    const dy = (y - prevY) / sample;

    for (let i = 0; i < sample; i++) {
      const drawX = prevX + dx * i;
      const drawY = prevY + dy * i;

      ctx.drawImage(
        imgRef.current,
        drawX - imageDimensions.width / 2,
        drawY - imageDimensions.height / 2,
        imageDimensions.width,
        imageDimensions.height
      );
    }

    setMouse({ prevX: x, prevY: y, x, y });
  };

  const handleMouseUp = (e) => {
    e.preventDefault();
    setIsDragging(false);

    // cycle through images
    if (images.length > 0) {
      setImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  useEffect(() => {
    const moveCursor = (e) => {
      if (!cursor.current) return;
      cursor.current.style.left = `${e.clientX}px`;
      cursor.current.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Get Image Indexes
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 200);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <>
      {!hasClicked && (
        <MediaCursor
          ref={mediaRef}
          medium={images[index]}
          showMedia={showCursor}
          dimensions={{ width: 20, height: 25 }}
        />
      )}
      <div
        ref={container}
        className={styles.picture_brush}
        style={{ width: "100%", height: "calc(100vh - calc(2 * var(--margin)))" }}
      >
        <canvas
          ref={canvas}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{ cursor: hasClicked ? "crosshair" : "none" }}
          onMouseEnter={() => setShowCursor(true)}
          onMouseLeave={() => setShowCursor(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        />
      </div>
    </>
  );
};

export default PictureBrush;
