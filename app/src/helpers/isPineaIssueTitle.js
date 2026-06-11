export const isPineaIssueTitle = (value = "") => {
  const text = String(value || "").trim();
  return /\bP\.?I\.?N\.?E\.?A\b/i.test(text) && /\d/.test(text);
};
