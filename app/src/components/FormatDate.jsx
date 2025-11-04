"use client";

const FormatDate = ({ date, className, format }) => {
  const formatted = new Date(date).toLocaleDateString("de-DE", format);

  return <time className={className}>{formatted}</time>;
};

export default FormatDate;

// FormatDate.jsx
// "use client";
// import { useEffect, useState } from "react";

// export default function FormatDate({ date, format }) {
//   const [formatted, setFormatted] = useState("");

//   useEffect(() => {
//     setFormatted(
//       new Date(date).toLocaleDateString("de-DE", format)
//     );
//   }, [date, format]);

//   return <time>{formatted}</time>;
// }
