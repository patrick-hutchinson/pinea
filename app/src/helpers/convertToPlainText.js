export function convertToPlainText(blocks) {
  const blocksArray = Array.isArray(blocks) ? blocks : [blocks]; // wrap non-array in array

  return blocksArray
    .map((block) => {
      if (!block) return "";
      if (typeof block === "string") return block;
      if (block._type !== "block" || !block.children) return "";
      return block.children.map((child) => child.text).join("");
    })
    .join("\n\n");
}
