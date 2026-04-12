"use client";

import { useRef, useState, useEffect, useContext, useLayoutEffect } from "react";

import styles from "./PictureBrush.module.css";
import MediaCursor from "@/components/MediaCursor/MediaCursor";
import { StateContext } from "@/context/StateContext";

const getRandomIndex = (length) => {
  if (!length) return 0;
  return Math.floor(Math.random() * length);
};

const PictureBrush = ({ images, hasEntered, cursorLabel }) => {
  const cursor = useRef(null);
  const [hasClicked, setHasClicked] = useState(false);

  const { isMobile, isTouch } = useContext(StateContext);

  const container = useRef(null);
  const canvas = useRef(null);

  const [hasScrolled, setHasScrolled] = useState(false);

  const [isDragging, setIsDragging] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0, prevX: 0, prevY: 0 });

  // The brush image index (changes on mouse up / touch end)
  const [imageIndex, setImageIndex] = useState(0);

  const [showCursor, setShowCursor] = useState(true);

  const sample = 50; // how many samples to interpolate between moves
  const imgRef = useRef(null);

  // Track which index imgRef currently represents (prevents "first draw uses old image")
  const loadedIndexRef = useRef(null);

  const [imageDimensions, setImageDimensions] = useState({ width: 200, height: 300 });

  const mediaRef = useRef(null);

  // Cursor preview index (cycles quickly)
  const [index, setIndex] = useState(0);

  // Ensure we randomize start only once per images payload
  const didInitIndex = useRef(false);

  function getTouchPos(e) {
    const rect = canvas.current.getBoundingClientRect();
    const touch = e.touches[0];

    return {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top,
    };
  }

  function getMousePos(e) {
    const rect = canvas.current.getBoundingClientRect();

    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  // ✅ Randomize the starting image ONCE when images arrive
  useEffect(() => {
    if (!images?.length) return;

    // If the images array changes identity often but contents are same,
    // you can reset this ref manually elsewhere. For now: initialize once.
    if (didInitIndex.current) return;

    didInitIndex.current = true;

    const start = getRandomIndex(images.length);
    setImageIndex(start);
    setIndex(start); // start preview cursor from same random
  }, [images]);

  // ✅ Load the current brush image when imageIndex changes (single source of truth)
  useEffect(() => {
    if (!images?.length) return;
    const url = images[imageIndex]?.url;
    if (!url) return;

    const img = new Image();
    img.src = url;

    img.onload = () => {
      imgRef.current = img;
      loadedIndexRef.current = imageIndex;

      // pick a random brush size per image load
      const base = isMobile ? 100 : 200;
      const multiplier = isMobile ? 30 : 80;

      const randomWidth = Math.random() * (base - multiplier) + multiplier;
      const height = randomWidth / images[imageIndex].aspectRatio;

      setImageDimensions({ width: randomWidth, height });
    };
  }, [images, imageIndex, isMobile]);

  // ✅ Detect whether user has scrolled at all (your old logic compared 0..1 to px)
  useEffect(() => {
    const checkScroll = () => {
      setHasScrolled(window.scrollY > 10);
    };

    // run once after layout settles
    requestAnimationFrame(checkScroll);

    window.addEventListener("scroll", checkScroll, { passive: true });
    return () => window.removeEventListener("scroll", checkScroll);
  }, []);

  function resizeCanvasForDPR(canvasEl, w, h) {
    const dpr = window.devicePixelRatio || 1;

    canvasEl.width = w * dpr;
    canvasEl.height = h * dpr;

    canvasEl.style.width = w + "px";
    canvasEl.style.height = h + "px";

    const ctx = canvasEl.getContext("2d");
    // Reset transform before scaling (important on repeated resize)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    ctx.imageSmoothingEnabled = false;
  }

  // Keep canvas in sync with container size and DPR.
  useLayoutEffect(() => {
    const updateSize = () => {
      if (!container.current) return;

      const w = Math.round(container.current.clientWidth);
      const h = Math.round(container.current.clientHeight);
      if (!w || !h) return;

      if (canvas.current) {
        resizeCanvasForDPR(canvas.current, w, h);
      }

      // Reset previous mouse position
      setMouse((prev) => ({ ...prev, prevX: 0, prevY: 0 }));
    };

    updateSize();

    let resizeObserver = null;
    if (typeof ResizeObserver !== "undefined") {
      resizeObserver = new ResizeObserver(updateSize);
      if (container.current) resizeObserver.observe(container.current);
    }

    window.addEventListener("resize", updateSize);
    return () => {
      if (resizeObserver) resizeObserver.disconnect();
      window.removeEventListener("resize", updateSize);
    };
  }, []);

  const drawStamp = (ctx, x, y) => {
    // Guard: only draw if current image is loaded for current index
    const canDraw = imgRef.current && loadedIndexRef.current === imageIndex;
    if (!canDraw) return;

    ctx.drawImage(
      imgRef.current,
      x - imageDimensions.width / 2,
      y - imageDimensions.height / 2,
      imageDimensions.width,
      imageDimensions.height,
    );
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setHasClicked(true);

    if (!canvas.current) return;
    const ctx = canvas.current.getContext("2d");
    ctx.imageSmoothingQuality = "high";

    const { x, y } = getMousePos(e.nativeEvent);

    setMouse((prev) => ({ ...prev, prevX: x, prevY: y, x, y }));
    setIsDragging(true);

    drawStamp(ctx, x, y);
  };

  const handleMouseMove = (e) => {
    mediaRef.current?.handleMouseMove(e);

    if (!isDragging) return;
    if (!canvas.current) return;

    e.preventDefault();

    const ctx = canvas.current.getContext("2d");

    const { x, y } = getMousePos(e.nativeEvent);

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

    // cycle through images (continues from randomized start)
    if (images?.length) {
      setImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  const handleTouchStart = (e) => {
    e.preventDefault();
    setHasClicked(true);

    if (!canvas.current) return;

    const { x, y } = getTouchPos(e);
    setMouse((prev) => ({ ...prev, prevX: x, prevY: y, x, y }));
    setIsDragging(true);

    const ctx = canvas.current.getContext("2d");
    ctx.imageSmoothingQuality = "high";

    drawStamp(ctx, x, y);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    if (!canvas.current) return;

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

    if (images?.length) {
      setImageIndex((prev) => (prev + 1) % images.length);
    }
  };

  // (Optional) follow cursor ref if you still use it somewhere else
  useEffect(() => {
    const moveCursor = (e) => {
      if (!cursor.current) return;
      cursor.current.style.left = `${e.clientX}px`;
      cursor.current.style.top = `${e.clientY}px`;
    };

    window.addEventListener("mousemove", moveCursor);
    return () => window.removeEventListener("mousemove", moveCursor);
  }, []);

  // Preview cursor cycling
  useEffect(() => {
    if (!images?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 200);

    return () => clearInterval(interval);
  }, [images?.length]);

  return (
    <>
      {!hasClicked && !hasScrolled && (
        <MediaCursor
          ref={mediaRef}
          medium={images?.[index]}
          showMedia={showCursor}
          dimensions={{ width: 40, height: 50 }}
          label={cursorLabel}
        />
      )}

      <div
        ref={container}
        className={styles.picture_brush}
        style={{
          width: "100%",
          height: "calc(100vh)",
          pointerEvents: hasEntered && isTouch ? "none" : "all",
        }}
      >
        <canvas
          ref={canvas}
          style={{
            cursor: isMobile ? "default" : hasClicked ? "crosshair" : "none",
          }}
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
    </>
  );
};

export default PictureBrush;
