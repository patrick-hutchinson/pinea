export function onSearch(params, events) {
  if (!params || !params.startDate || !params.endDate) {
    return events; // return unfiltered list
  }

  const { startDate, endDate } = params;
  const from = new Date(`${startDate.month} 1, ${startDate.year}`);
  const to = new Date(`${endDate.month} 1, ${endDate.year}`);
  to.setMonth(to.getMonth() + 1);
  to.setDate(0); // last day of end month

  return events.filter((event) => {
    const start = new Date(event.startDate);
    const end = new Date(event.endDate || event.startDate);
    return start <= to && end >= from; // overlaps range
  });
}
