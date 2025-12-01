"use client";

import LayoutSwitcher from "../../../../components/Stories/LayoutSwitcher";

const ReviewPage = ({ reviews, review }) => {
  return <LayoutSwitcher story={review} stories={reviews} />;
};

export default ReviewPage;
