"use client";

const FormatDate = ({ date, className, format }) => {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (Number.isNaN(parsedDate.getTime())) return null;

  const formatted = parsedDate.toLocaleDateString("de-DE", format);

  return <time className={className}>{formatted}</time>;
};

export default FormatDate;
