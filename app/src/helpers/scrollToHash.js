// utils/scrollToHash.js
export const scrollToHash = (offset = 0) => {
  console.log("calling hash function");
  if (typeof window === "undefined" || !window.location.hash) return;

  const id = window.location.hash.replace("#", "");
  console.log("id:", id);
  const el = document.getElementById(id);
  console.log(el, "element found");
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.pageYOffset + offset;
  console.log(el.getBoundingClientRect().top, "el.getBoundingClientRect().top");
  window.scrollTo({ top: y, behavior: "smooth" });
};
