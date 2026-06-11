export const formatShopPrice = (amount, currencyCode) => {
  const value = Number(amount);
  if (Number.isNaN(value)) return "";

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode || "USD",
  });
  const parts = formatter.formatToParts(value);
  const currency = parts.find((part) => part.type === "currency")?.value;

  if (!currency) return formatter.format(value);

  const currencyIndex = parts.findIndex((part) => part.type === "currency");
  const prefix = parts
    .slice(0, currencyIndex)
    .filter((part) => part.type !== "literal")
    .map((part) => part.value)
    .join("");
  const number = parts
    .slice(currencyIndex + 1)
    .filter((part) => !(part.type === "literal" && part.value.trim() === ""))
    .map((part) => part.value)
    .join("")
    .trim();

  return `${prefix}${currency}\u00a0${number}`;
};
