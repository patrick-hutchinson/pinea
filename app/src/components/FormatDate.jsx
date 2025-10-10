const FormatDate = ({ date, className, options }) => {
  const formatted = new Date(date).toLocaleDateString("de-DE", options);

  return <time className={className}>{formatted}</time>;
};

export default FormatDate;
