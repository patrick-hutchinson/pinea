const GRID_COLUMNS = 4;

const SIZE_DEFINITIONS = {
  full: { w: 4, h: 2 },
  half: { w: 2, h: 2 },
  quarter: { w: 2, h: 1 },
  eigth: { w: 1, h: 1 },
};

const SIZE_OPTIONS_BY_TYPE = {
  visit: ["half", "full"],
  review: ["half", "full"],
  portfolio: ["eigth", "quarter", "half"],
  "spot-on": ["half"],
  person: ["eigth"],
};

const ensureRows = (grid, rowCount) => {
  while (grid.length < rowCount) {
    grid.push(new Array(GRID_COLUMNS).fill(false));
  }
};

const cloneGrid = (grid) => grid.map((row) => [...row]);

const canPlaceAt = (grid, row, col, sizeDef) => {
  const { w, h } = sizeDef;
  if (col + w > GRID_COLUMNS) return false;

  ensureRows(grid, row + h);

  for (let r = row; r < row + h; r += 1) {
    for (let c = col; c < col + w; c += 1) {
      if (grid[r][c]) return false;
    }
  }

  return true;
};

const findPlacement = (grid, cursor, sizeDef) => {
  let row = cursor.row;
  let col = cursor.col;

  for (let i = 0; i < 5000; i += 1) {
    if (canPlaceAt(grid, row, col, sizeDef)) return { row, col };

    col += 1;
    if (col >= GRID_COLUMNS) {
      col = 0;
      row += 1;
    }
  }

  return { row, col };
};

const placeItem = (grid, placement, sizeDef) => {
  const { row, col } = placement;
  const { w, h } = sizeDef;

  ensureRows(grid, row + h);

  for (let r = row; r < row + h; r += 1) {
    for (let c = col; c < col + w; c += 1) {
      grid[r][c] = true;
    }
  }
};

const nextCursor = (placement, sizeDef) => {
  const next = {
    row: placement.row,
    col: placement.col + sizeDef.w,
  };

  while (next.col >= GRID_COLUMNS) {
    next.col -= GRID_COLUMNS;
    next.row += 1;
  }

  return next;
};

const linearIndex = (cursor) => cursor.row * GRID_COLUMNS + cursor.col;

const countEmptyCellsBeforeCursor = (grid, cursor) => {
  const limit = linearIndex(cursor);
  let empty = 0;

  for (let idx = 0; idx < limit; idx += 1) {
    const row = Math.floor(idx / GRID_COLUMNS);
    const col = idx % GRID_COLUMNS;
    if (!grid[row]?.[col]) empty += 1;
  }

  return empty;
};

const getAllowedSizes = (item) => SIZE_OPTIONS_BY_TYPE[item?.type] || ["half"];

export const layoutStories = (data) => {
  if (!Array.isArray(data) || data.length === 0) return [];

  const result = [];
  const grid = [];
  let cursor = { row: 0, col: 0 };

  data.forEach((item) => {
    const allowedSizes = getAllowedSizes(item);
    const candidates = allowedSizes.map((sizeName, order) => {
      const sizeDef = SIZE_DEFINITIONS[sizeName];
      const testGrid = cloneGrid(grid);
      const placement = findPlacement(testGrid, cursor, sizeDef);
      placeItem(testGrid, placement, sizeDef);
      const testCursor = nextCursor(placement, sizeDef);

      return {
        sizeName,
        order,
        placement,
        score: countEmptyCellsBeforeCursor(testGrid, testCursor),
      };
    });

    candidates.sort((a, b) => (a.score === b.score ? a.order - b.order : a.score - b.score));

    const selected = candidates[0];
    const selectedDef = SIZE_DEFINITIONS[selected.sizeName];
    placeItem(grid, selected.placement, selectedDef);
    cursor = nextCursor(selected.placement, selectedDef);

    result.push({ size: selected.sizeName, item });
  });

  return result;
};
