import { translate } from "@/helpers/translate";

const getDuration = (event) => new Date(event.endDate) - new Date(event.startDate);

export const sortEvents = (a, b) => {
  const countryA = translate(a.location.country.name);
  const countryB = translate(b.location.country.name);
  const isAustriaA = countryA.toLowerCase().includes("austria") || countryA.toLowerCase().includes("österreich");
  const isAustriaB = countryB.toLowerCase().includes("austria") || countryB.toLowerCase().includes("österreich");

  if (isAustriaA && !isAustriaB) return -1;
  if (isAustriaB && !isAustriaA) return 1;

  const countryCompare = countryA.localeCompare(countryB);
  if (countryCompare !== 0) return countryCompare;

  const cityA = translate(a.location.city || "");
  const cityB = translate(b.location.city || "");
  const cityCompare = cityA.localeCompare(cityB);
  if (cityCompare !== 0) return cityCompare;

  const instA = translate(a.location.institution || "");
  const instB = translate(b.location.institution || "");
  const instCompare = instA.localeCompare(instB);
  if (instCompare !== 0) return instCompare;

  const durA = getDuration(a);
  const durB = getDuration(b);
  return durA - durB;
};

// // 🧹 Exclude hosted events before sorting
// const sortedEvents = filteredEvents.filter((event) => !event.highlight?.hosted).sort(sortEvents);

// // If you still want them grouped by country afterwards:
// export const sortedEntries = Object.entries(
//   sortedEvents.reduce((acc, event) => {
//     const countryName = translate(event.location.country.name);
//     (acc[countryName] ??= []).push(event);
//     return acc;
//   }, {})
// );
