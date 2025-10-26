// helpers/calcRadius.js
export const calculateRadius = (width, count) => {
  if (!count) return 100;
  const baseWidth = 1000;
  const baseMultiplier = 1.5;
  const multiplier = baseMultiplier * (width / baseWidth);
  return Math.max(100, (width / 2 / Math.tan(Math.PI / count)) * multiplier);
};
