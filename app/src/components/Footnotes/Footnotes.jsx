const Footnotes = ({ text }) => {
  if (!text) return null;

  // Collect all markDefs of type "footnote" from all blocks
  const footnotes = text.flatMap((block) => block.markDefs || []).filter((def) => def._type === "footnote");

  if (footnotes.length === 0) return null;

  return (
    <ol className="footnotes" style={{ marginTop: "2rem" }}>
      {footnotes.map((fn, index) => (
        <li key={fn._key} id={`footnote-${index + 1}`}>
          {index} {fn.text}
        </li>
      ))}
    </ol>
  );
};

export default Footnotes;
