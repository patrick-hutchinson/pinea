import { renderMedia } from "@/helpers/renderMedia";

import "./CoverMedia.module.css";

const CoverMedia = ({ item, useCopyrightOverlay, className, children }) => (
  <div className={`coverMedia ${className || ""}`}>
    <div className="coverMediaRender">
      {renderMedia(item, useCopyrightOverlay)}
    </div>

    {children}
  </div>
);

export default CoverMedia;
