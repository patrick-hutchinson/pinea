export const calculateTextWidth = (text, fontSize) => {
  if (typeof document === "undefined") return 0; // server-side fallback

  const font = `${fontSize} Arial`;
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  context.font = font;

  return context.measureText(text).width;
};
