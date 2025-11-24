import { client } from "@/lib/client";

const MediaKitDownload = ({ file }) => {
  const handleDownload = async () => {
    const response = await fetch(file.asset.url);
    const blob = await response.blob();

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = file.originalFilename || "MediaKit.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ cursor: "pointer" }} onClick={handleDownload} className="button">
      Media Kit
    </div>
  );
};

export default MediaKitDownload;
