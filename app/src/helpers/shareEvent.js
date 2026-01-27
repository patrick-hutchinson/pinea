export const handleShare = async (url) => {
  // const firstSegment = window.location.pathname.split("/")[1] || "";

  // const url = `/${firstSegment}#${slug}`;

  if (navigator.share) {
    try {
      await navigator.share({
        title: document.title,
        text: "Share this event:",
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
