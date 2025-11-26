export const handleShare = async () => {
  const url = window.location.href;

  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: "Check this out:",
        url,
      });
      console.log("Shared successfully!");
    } catch (err) {
      console.warn("Share canceled or failed:", err);
    }
  } else if (navigator.clipboard) {
    try {
      await navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy link:", err);
      alert("Unable to share or copy link.");
    }
  } else {
    // fallback prompt
    prompt("Copy this link:", url);
  }
};
