import { renderMedia } from "@/helpers/renderMedia";

import styles from "./CoverMedia.module.css";

const CoverMedia = ({ item, useCopyrightOverlay, className, children }) => (
  <div className={`coverMedia ${className}`}>
    {renderMedia(item, useCopyrightOverlay)}

    {children}
  </div>
);

export default CoverMedia;
