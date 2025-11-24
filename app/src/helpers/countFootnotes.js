export function countFootnotes(blocks, allFootnotes) {
  const keys = new Set(blocks.flatMap((b) => (b.markDefs || []).map((def) => def._key)));
  return allFootnotes.filter((fn) => keys.has(fn._key)).length - 1;
}
