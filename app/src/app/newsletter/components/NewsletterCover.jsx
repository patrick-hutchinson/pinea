const NewsletterCover = ({ src }) => {
  return (
    <table
      width="100%"
      border="0"
      cellPadding="0"
      cellSpacing="0"
      style={{
        backgroundColor: "#000",
        width: "100%",
      }}
    >
      <tbody>
        <tr>
          <td
            align="center"
            valign="middle"
            style={{
              padding: "0",
              margin: "0",
              height: "500px",
            }}
          >
            <img
              src={src}
              alt=""
              border="0"
              style={{
                display: "block",
                width: "50%",
                maxWidth: "300px",
                height: "auto",
                margin: "0 auto",
              }}
            />
          </td>
        </tr>
      </tbody>
    </table>
  );
};

export default NewsletterCover;
