export const handleShare = async () => {
  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: "Check this out:",
        url: window.location.href,
      });
      console.log("Shared successfully!");
    } catch (err) {
      console.warn("Share canceled or failed:", err);
    }
  } else {
    alert("Your browser doesn’t support the native share menu.");
  }
};
