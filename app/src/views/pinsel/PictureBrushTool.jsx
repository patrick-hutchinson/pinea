"use client";

import { useRef, useState, useEffect, useContext, useMemo } from "react";

import styles from "@/components/PictureBrush/PictureBrush.module.css";
import MediaCursor from "@/components/MediaCursor/MediaCursor";
import { StateContext } from "@/context/StateContext";
import { exportCanvas } from "./helpers/exportCanvas";
import Button from "@/components/Buttons/Button";

const getRandomIndex = (length) => {
  if (!length) return 0;
  return Math.floor(Math.random() * length);
};

const PictureBrushTool = ({ imageSets }) => {
  const validImageSets = useMemo(
    () =>
      Array.isArray(imageSets)
        ? imageSets.filter((set) => Array.isArray(set?.images) && set.images.length > 1)
        : [],
    [imageSets],
  );
  const [images, setImages] = useState(validImageSets[0]?.images ?? []);
  const [selectedSetIndex, setSelectedSetIndex] = useState(0);
  const cursor = useRef(null);
  const [hasClicked, setHasClicked] = useState(false);

  const { isMobile, isTouch } = useContext(StateContext);

  const container = useRef(null);
  const canvas = useRef(null);

  const [canvasSize, setCanvasSize] = useState({ w: 0, h: 0 });

  const [isDragging, setIsDragging] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0, prevX: 0, prevY: 0 });
  const [imageIndex, setImageIndex] = useState(0);

  const [showCursor, setShowCursor] = useState(true);

  const sample = 50; // how many samples to interpolate between moves
  const imgRef = useRef(null);
  const strokesRef = useRef([]);

  const [imageDimensions, setImageDimensions] = useState({ width: 200, height: 300 });

  const mediaRef = useRef(null);

  const clearCanvas = () => {
    if (!canvas.current) return;

    const ctx = canvas.current.getContext("2d");
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.current.width, canvas.current.height);
    ctx.restore();
    strokesRef.current = [];
  };

  const drawStamp = (ctx, x, y) => {
    if (!imgRef.current) return;

    const width = imageDimensions.width;
    const height = imageDimensions.height;

    ctx.drawImage(imgRef.current, x - width / 2, y - height / 2, width, height);

    strokesRef.current.push({
      imageIndex,
      x,
      y,
      width,
      height,
    });
  };

  function getTouchPos(e) {
    const rect = canvas.current.getBoundingClientRect();
    const touch = e.touches[0];

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  useEffect(() => {
    const base = isMobile ? 100 : 200;
    const activeImage = images[imageIndex];
    if (!activeImage?.url) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // <- required
    img.src = activeImage.url;

    img.onload = () => {
      imgRef.current = img;

      const multiplier = isMobile ? 30 : 80;

      const randomWidth = Math.random() * (base - multiplier) + multiplier;
      const height = randomWidth / (activeImage.aspectRatio || 1);

      setImageDimensions({ width: randomWidth, height });
    };
  }, [images, imageIndex]);

  useEffect(() => {
    const activeImage = images[imageIndex];
    if (!activeImage?.url) return;

    const img = new Image();
    img.crossOrigin = "anonymous"; // <- required
    img.src = activeImage.url;

    img.onload = () => {
      imgRef.current = img;
    };
  }, [images, imageIndex]);

  function resizeCanvasForDPR(canvas, w, h) {
    const dpr = window.devicePixelRatio || 1;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    canvas.style.width = w + "px";
    canvas.style.height = h + "px";

    const ctx = canvas.getContext("2d");
    ctx.scale(dpr, dpr); // important!
    ctx.imageSmoothingEnabled = false;
  }

  // Handle Window Resize
  useEffect(() => {
    const updateSize = () => {
      const w = container.current.clientWidth;
      const h = container.current.clientHeight;
      setCanvasSize({ w, h });

      if (canvas.current) {
        resizeCanvasForDPR(canvas.current, w, h);
      }

      // Resize clears bitmap; keep export state in sync.
      strokesRef.current = [];

      // ✅ Reset previous mouse position
      setMouse((prev) => ({ ...prev, prevX: 0, prevY: 0 }));
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    setHasClicked(true);

    const ctx = canvas.current.getContext("2d");

    ctx.imageSmoothingQuality = "high";

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;

    setMouse((prev) => ({ ...prev, prevX: x, prevY: y, x, y }));
    setIsDragging(true);

    drawStamp(ctx, x, y);
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

      drawStamp(ctx, drawX, drawY);
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

  const handleTouchStart = (e) => {
    e.preventDefault();
    setHasClicked(true);

    const { x, y } = getTouchPos(e);
    setMouse((prev) => ({ ...prev, prevX: x, prevY: y, x, y }));
    setIsDragging(true);

    const ctx = canvas.current.getContext("2d");

    ctx.imageSmoothingQuality = "high";

    drawStamp(ctx, x, y);
  };

  const handleTouchMove = (e) => {
    if (!isDragging || !imgRef.current) return;

    e.preventDefault();
    const { x, y } = getTouchPos(e);
    const ctx = canvas.current.getContext("2d");

    const { prevX, prevY } = mouse;
    const dx = (x - prevX) / sample;
    const dy = (y - prevY) / sample;

    for (let i = 0; i < sample; i++) {
      const drawX = prevX + dx * i;
      const drawY = prevY + dy * i;

      drawStamp(ctx, drawX, drawY);
    }

    setMouse({ prevX: x, prevY: y, x, y });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
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
    setSelectedSetIndex(0);
    setImages(validImageSets[0]?.images ?? []);
  }, [validImageSets]);

  useEffect(() => {
    if (!images.length) {
      setImageIndex(0);
      setIndex(0);
      return;
    }

    setImageIndex((prev) => prev % images.length);
    setIndex((prev) => prev % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!images.length) return;

    const randomStartIndex = getRandomIndex(images.length);
    setImageIndex(randomStartIndex);
    setIndex(randomStartIndex);
  }, [images]);

  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 200);

    return () => clearInterval(interval);
  }, [images.length]);

  const cursorMedium = images[index] ?? images[0];

  return (
    <>
      {!hasClicked && cursorMedium && (
        <MediaCursor ref={mediaRef} medium={cursorMedium} showMedia={showCursor} dimensions={{ width: 40, height: 50 }} />
      )}
      <div
        ref={container}
        className={styles.picture_brush}
        style={{ width: "100%", height: "calc(100vh)", pointerEvents: "all" }}
      >
        <canvas
          ref={canvas}
          width={canvasSize.w}
          height={canvasSize.h}
          style={{ cursor: isMobile ? "default" : hasClicked ? "crosshair" : "none" }}
          onMouseEnter={() => setShowCursor(true)}
          onMouseLeave={() => setShowCursor(false)}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        />
      </div>

      <Button
        className={styles.renderButton}
        onClick={() =>
          exportCanvas({
            canvasRef: canvas,
            sourceWidth: canvasSize.w,
            sourceHeight: canvasSize.h,
            images,
            stamps: strokesRef.current,
          })
        }
      >
        Render
      </Button>

      <div
        style={{
          display: "flex",
          gap: "var(--margin)",
          padding: "var(--margin)",
          position: "absolute",
          bottom: "0",
          left: "0",
          zIndex: 4,
          cursor: "pointer",
        }}
      >
        {validImageSets.map((imageSet, imageSetIndex) => (
          <div
            key={imageSet.title || imageSetIndex}
            onClick={() => {
              clearCanvas();
              setSelectedSetIndex(imageSetIndex);
              setImages(imageSet.images);
            }}
            style={{
              opacity: selectedSetIndex === imageSetIndex ? 1 : 0.5,
            }}
          >
            {imageSet.title || `Set ${imageSetIndex + 1}`}
          </div>
        ))}
      </div>
    </>
  );
};

export default PictureBrushTool;
