export function onSearch(params, events, selectedLabels = []) {
  const from = params?.startDate || null;
  const to = params?.endDate || null;

  if (to) {
    // Extend to the end of the month if needed
    const lastDay = new Date(to.getFullYear(), to.getMonth() + 1, 0);
    to.setTime(lastDay.getTime());
  }

  return events.filter((event) => {
    // Date filtering
    const start = new Date(event.startDate);
    const end = new Date(event.endDate || event.startDate);

    const dateMatch = !from || !to ? true : start <= to && end >= from;

    // Convert highlight object into array of active labels
    const eventLabels = event.highlight
      ? Object.entries(event.highlight)
          .filter(([key, value]) => value)
          .map(([key]) => key.toUpperCase())
      : [];

    if (event.recommended) eventLabels.push("RECOMMENDED");

    // Label filter: empty selectedLabels = all active
    const labelMatch = selectedLabels.length === 0 || eventLabels.some((l) => selectedLabels.includes(l));

    return dateMatch && labelMatch;
  });
}
