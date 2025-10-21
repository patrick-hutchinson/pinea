// // lib/i18n.ts
// export function getLocalized(arrayString: { _key: string; [lang: string]: string }[], lang: string) {
//   const item = arrayString.find((i) => i[lang]);
//   return item ? item[lang] : arrayString[0]?.en || "";
// }

// export function localizeEvent(event, lang) {
//   return {
//     ...event,
//     title: getLocalized(event.title, lang),
//     description: getLocalized(event.description, lang),
//     // add other fields you want localized
//   };
// }

// export function localizeEvents(events, lang) {
//   return events.map((event) => localizeEvent(event, lang));
// }
