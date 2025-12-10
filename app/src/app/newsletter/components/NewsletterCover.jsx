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
      <img style={{ height: "80%", width: "auto", alignItems: "center" }} src={src} />
    </div>
  );
};

export default NewsletterCover;
