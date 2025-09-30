const FormatDate = ({ date, className }) => {
  const formatted = new Date(date).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return <time className={className}>{formatted}</time>;
};

export default FormatDate;
