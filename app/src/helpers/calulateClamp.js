export const calculateClamp = () => {
  const minWidth = 128;
  const maxWidth = 220;

  const minValue = 4;
  const maxValue = 4.8;

  const slope = (maxValue - minValue) / (maxWidth - minWidth);
  const yAxisIntersection = -minWidth * slope + minValue;

  return `clamp(${minValue}rem, ${yAxisIntersection}rem + ${slope * 100}vw, ${maxValue}rem)`;
};
