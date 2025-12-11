import styles from "../Newsletter.module.css";

const NewsletterCover = ({ src }) => {
  return (
    <div
      style={{
        width: "100%",
        background: "#000",
        display: "flex",
        alignItems: "center",
        justifyContent: " center",
        height: "500px",
      }}
    >
      <img style={{ height: "auto", width: "50%", maxWidth: "300px", alignItems: "center" }} src={src} />
    </div>
  );
};

export default NewsletterCover;
