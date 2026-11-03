import { useEffect } from "react";

export const getCoverMediaBlurProgress = (triggerTop, viewportHeight) =>
  Math.min(Math.max((viewportHeight - triggerTop) / (viewportHeight * 0.5), 0), 1);

export default function useCoverMediaBlur(mediaRef, triggerRef, enabled = true) {
  useEffect(() => {
    if (!enabled || !mediaRef.current || !triggerRef.current) return undefined;

    let frame = null;
    const mediaElement = mediaRef.current;
    const triggerElement = triggerRef.current;
    const updateBlurProgress = () => {
      frame = null;
      const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 1;
      const progress = getCoverMediaBlurProgress(triggerElement.getBoundingClientRect().top, viewportHeight);
      mediaElement.style.setProperty("--story-cover-blur-progress", progress.toString());
    };
    const requestUpdate = () => {
      if (frame !== null) return;
      frame = window.requestAnimationFrame(updateBlurProgress);
    };

    updateBlurProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      if (frame !== null) window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      mediaElement.style.removeProperty("--story-cover-blur-progress");
    };
  }, [mediaRef, triggerRef, enabled]);
}
