export function onSearch(params, events, selectedLabels = []) {
  const from = params?.startDate ? new Date(`${params.startDate.month} 1, ${params.startDate.year}`) : null;
  const to = params?.endDate ? new Date(`${params.endDate.month} 1, ${params.endDate.year}`) : null;

  if (to) {
    to.setMonth(to.getMonth() + 1);
    to.setDate(0);
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
