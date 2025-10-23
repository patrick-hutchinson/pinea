// utils/scrollToHash.js
export const scrollToHash = (offset = 0) => {
  if (typeof window === "undefined" || !window.location.hash) return;

  const id = window.location.hash.replace("#", "");
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: y, behavior: "smooth" });
};
