import Label from "@/components/Label";
import FormatDate from "@/components/FormatDate";
import Text from "@/components/Text";

const OpenCall = ({ openCall }) => {
  return (
    <li style={{ borderTop: "1px solid #000", padding: "var(--margin) 0", paddingBottom: "calc(var(--margin) * 3)" }}>
      <div style={{ display: "flex", gap: "var(--margin)" }}>
        <Label>
          <FormatDate date={openCall.date} format={{ month: "short", day: "numeric" }} />
        </Label>
        <h2 style={{ textTransform: "uppercase" }}>{openCall.title}</h2>
      </div>
      <h2>
        <Text text={openCall.description} />
      </h2>
    </li>
  );
};

export default OpenCall;
