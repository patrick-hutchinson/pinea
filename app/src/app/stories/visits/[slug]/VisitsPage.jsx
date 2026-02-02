"use client";

import LayoutSwitcher from "@/components/Stories/LayoutSwitcher";

const VisitsPage = ({ interview, interviews }) => {
  return <LayoutSwitcher story={interview} stories={interviews} />;
};

export default VisitsPage;
