export const sortAlphabetically = (arr) => {
  return [...arr].sort((a, b) => a.localeCompare(b, undefined, { sensitivity: "base" }));
};
