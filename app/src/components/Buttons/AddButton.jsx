import Icon from "@/components/Icon/Icon";

const AddButton = ({ onClick }) => {
  return (
    <span style={{ height: "14px", width: "14px", aspectRatio: 1, cursor: "pointer" }}>
      <Icon path="icons/add-button.svg" onClick={onClick} />
    </span>
  );
};

export default AddButton;
