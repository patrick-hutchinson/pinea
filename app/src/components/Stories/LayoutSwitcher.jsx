import LayoutA from "./Layouts/LayoutA/LayoutA";
import LayoutB from "./Layouts/LayoutB/LayoutB";
import LayoutC from "./Layouts/LayoutC/LayoutC";
import LayoutD from "./Layouts/LayoutD/LayoutD";

const LayoutSwitcher = ({ story, stories }) => {
  switch (story.layout) {
    case "layoutA":
      return <LayoutA story={story} stories={stories} />;

    case "layoutB":
      return <LayoutB story={story} stories={stories} />;

    case "layoutC":
      return <LayoutC story={story} stories={stories} />;

    case "layoutD":
      return <LayoutD story={story} stories={stories} />;

    default:
      return <LayoutA story={story} stories={stories} />; // fallback
  }
};

export default LayoutSwitcher;
