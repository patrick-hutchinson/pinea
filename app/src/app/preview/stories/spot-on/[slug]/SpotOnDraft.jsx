import LayoutSwitcher from "@/components/Stories/LayoutSwitcher";

const SpotOnDraft = ({ story, stories }) => {
  console.log(story, "story");
  return <LayoutSwitcher story={story} stories={stories} />;
};

export default SpotOnDraft;
