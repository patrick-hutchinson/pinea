const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const parseDateOnly = (value) => {
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
};

const getEventDateValue = (event) => event?.endDate || event?.startDate || null;

export const parseEventDate = (value, { endOfDay = false } = {}) => {
  if (!value) return null;

  if (typeof value === "string" && DATE_ONLY_PATTERN.test(value)) {
    const date = parseDateOnly(value);
    if (!date) return null;
    if (endOfDay) date.setHours(23, 59, 59, 999);
    return date;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

export const isEventCurrent = (event, now = new Date()) => {
  const end = parseEventDate(getEventDateValue(event), { endOfDay: true });
  return end ? end >= now : true;
};

export const isPineaEventArchived = (event, now = new Date()) => {
  const end = parseEventDate(getEventDateValue(event));
  if (!end) return false;

  const cutoff = new Date(now);
  cutoff.setHours(0, 0, 0, 0);
  cutoff.setDate(cutoff.getDate() - 2);

  end.setHours(0, 0, 0, 0);
  return end <= cutoff;
};

export const isPineaEventCurrent = (event, now = new Date()) => !isPineaEventArchived(event, now);
