"use client";

import LayoutSwitcher from "../../../../components/Stories/LayoutSwitcher";

const SpotOnPage = ({ spotOns, spotOn }) => {
  return <LayoutSwitcher story={spotOn} stories={spotOns} />;
};

export default SpotOnPage;
