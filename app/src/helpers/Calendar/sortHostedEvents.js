import { parseEventDate } from "./eventTiming";

export const getEventEndTime = (event) => {
  const date = parseEventDate(event?.endDate || event?.startDate, { endOfDay: true });
  return date ? date.getTime() : -Infinity;
};

const getEventStartTime = (event) => {
  const date = parseEventDate(event?.startDate || event?.endDate);
  return date ? date.getTime() : Infinity;
};

const getHostedEventSortGroup = (event, nowTime) => {
  const startTime = getEventStartTime(event);
  const endTime = getEventEndTime(event);

  if (startTime <= nowTime && endTime >= nowTime) return 0;
  if (startTime > nowTime) return 1;
  return 2;
};

export const sortHostedEvents = (now) => {
  const nowTime = now.getTime();

  return (a, b) => {
    const groupA = getHostedEventSortGroup(a, nowTime);
    const groupB = getHostedEventSortGroup(b, nowTime);

    if (groupA !== groupB) return groupA - groupB;
    if (groupA === 0) return getEventEndTime(a) - getEventEndTime(b);
    if (groupA === 1) return getEventStartTime(a) - getEventStartTime(b);
    return getEventEndTime(b) - getEventEndTime(a);
  };
};
