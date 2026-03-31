import Icon from "@/components/Icon/Icon";

const AddButton = ({ onClick, className }) => {
  return (
    <span style={{ height: "14px", width: "14px", aspectRatio: 1, cursor: "pointer" }} className={className}>
      <Icon path="/icons/add-button.svg" onClick={onClick} />
    </span>
  );
};

export default AddButton;
