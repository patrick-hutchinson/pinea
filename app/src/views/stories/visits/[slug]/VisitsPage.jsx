"use client";

import LayoutSwitcher from "@/components/Stories/LayoutSwitcher";

const VisitsPage = ({ visit, visits }) => {
  return <LayoutSwitcher story={visit} stories={visits} />;
};

export default VisitsPage;
