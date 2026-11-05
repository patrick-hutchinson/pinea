/** @returns {"de" | "en"} */
export const normalizeGiftLanguage = (language) => String(language || "").toLowerCase() === "en" ? "en" : "de";

export const buildGiftCartAttributes = ({ recipientEmail, message = "", language = "de" }) => [
  { key: "Recipient email", value: recipientEmail.trim() },
  { key: "Message", value: message.trim() },
  { key: "Recipient language", value: normalizeGiftLanguage(language) },
];

export const getGiftMembershipGroups = (variants = []) => {
  const groups = new Map();

  for (const variant of variants) {
    const options = variant.selectedOptions || [];
    const membershipOption =
      options.find((option) => /membership|mitgliedschaft|tier/i.test(option.name)) || options[0];
    const label = membershipOption?.value || variant.title;
    if (!label) continue;

    if (!groups.has(label)) groups.set(label, { label, variants: [] });
    groups.get(label).variants.push({
      ...variant,
      selectionLabel:
        options
          .filter((option) => option !== membershipOption)
          .map((option) => option.value)
          .filter(Boolean)
          .join(" / ") || label,
    });
  }

  return [...groups.values()];
};
