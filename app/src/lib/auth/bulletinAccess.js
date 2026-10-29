export const MEMBERS_ONLY_PLACEHOLDERS = [
  {
    en: "Discover new opportunities in photography and visual culture. Become a P.IN.E.A member to read this open call in full.",
    de: "Entdecke neue Möglichkeiten in Fotografie und visueller Kultur. Als P.IN.E.A Mitglied kannst du diesen Open Call vollständig lesen.",
  },
  {
    en: "Find your next creative opportunity with P.IN.E.A. Members can explore the full details, requirements and application information.",
    de: "Finde deine nächste kreative Chance mit P.IN.E.A. Mitglieder erhalten alle Details zu Teilnahme, Voraussetzungen und Bewerbung.",
  },
  {
    en: "Explore selected opportunities for artists and photographers. Join P.IN.E.A to unlock this open call and more member benefits.",
    de: "Entdecke ausgewählte Chancen für Kunst und Fotografie. Mit deiner P.IN.E.A Mitgliedschaft erhältst du Zugang zu diesem Open Call.",
  },
];

export const redactMembersOnlyBulletins = (items, canViewMembersOnlyContent = false) => {
  if (!Array.isArray(items)) return [];
  let lockedIndex = 0;

  return items.map((item) => {
    const isMembersOnlyLocked = Boolean(item?.membersOnlyContent) && !canViewMembersOnlyContent;
    if (!isMembersOnlyLocked) return { ...item, isMembersOnlyLocked: false };

    const placeholder = MEMBERS_ONLY_PLACEHOLDERS[lockedIndex++ % MEMBERS_ONLY_PLACEHOLDERS.length];
    const text = Object.entries(placeholder).map(([language, value]) => ({ _key: language, value }));

    return { ...item, teaser: text, text, link: null, isMembersOnlyLocked: true };
  });
};
