import { useContext } from "react";

import { LanguageContext } from "@/context/LanguageContext";

const MediaKitDownload = ({ file }) => {
  const { language } = useContext(LanguageContext);
  const fileUrl = file?.asset?.url || null;
  const fileName = file?.asset?.originalFilename || file?.originalFilename || "MediaKit.pdf";

  const handleDownload = async () => {
    if (!fileUrl) return;

    const link = document.createElement("a");
    link.href = fileUrl;
    link.download = fileName;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!fileUrl) {
    return (
      <div style={{ cursor: "not-allowed", opacity: 0.4 }} className="button" aria-disabled="true">
        {language === "en" ? "Media Kit" : "Mediadaten"}
      </div>
    );
  }

  return (
    <div style={{ cursor: "pointer" }} onClick={handleDownload} className="button">
      {language === "en" ? "Media Kit" : "Mediadaten"}
    </div>
  );
};

export default MediaKitDownload;
