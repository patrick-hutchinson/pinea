const FormatDate = ({ date, className, format }) => {
  const formatted = new Date(date).toLocaleDateString("de-DE", format);

  return <time className={className}>{formatted}</time>;
};

export default FormatDate;
