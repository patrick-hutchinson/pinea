const ROW_UNITS = 4;

const SIZE_UNITS = {
  full: 4,
  half: 2,
  quarter: 2,
  eigth: 1,
};

const SIZE_OPTIONS_BY_TYPE = {
  visit: ["half", "full"],
  review: ["half", "full"],
  portfolio: ["eigth", "quarter", "half"],
  "spot-on": ["half"],
  person: ["eigth"],
};

const getAllowedSizes = (item) => SIZE_OPTIONS_BY_TYPE[item?.type] || ["half"];

export const layoutStories = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const result = [];
  let rowFill = 0;

  data.forEach((item) => {
    const allowedSizes = getAllowedSizes(item);
    const candidates = allowedSizes.map((sizeName, order) => {
      const units = SIZE_UNITS[sizeName] || 2;
      const remaining = ROW_UNITS - rowFill;
      const wraps = units > remaining;
      const startCol = wraps ? 0 : rowFill;
      const splitBreaks = units === 2 && startCol === 1;
      const wrapWaste = wraps ? remaining : 0;

      // Prefer no split-break first, then fewer wasted row units,
      // then keep declared category preference order.
      const score = (splitBreaks ? 100 : 0) + wrapWaste;

      return {
        sizeName,
        order,
        units,
        wraps,
        score,
      };
    });

    candidates.sort((a, b) => (a.score === b.score ? a.order - b.order : a.score - b.score));

    const selected = candidates[0];
    if (selected.wraps) rowFill = 0;
    rowFill += selected.units;
    if (rowFill >= ROW_UNITS) rowFill = 0;

    result.push({ size: selected.sizeName, item });
  });

  return result;
};
