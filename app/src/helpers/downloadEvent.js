export function downloadEvent(event) {
  const now = new Date();

  // Start 2 hours from now
  const startDate = new Date(now.getTime() + 2 * 60 * 60 * 1000);
  const start = startDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  // End 5 hours from now
  const endDate = new Date(now.getTime() + 5 * 60 * 60 * 1000);
  const end = endDate.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";

  const icsContent = `
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//YourSite//NONSGML v1.0//EN
BEGIN:VEVENT
UID:${Date.now()}@yoursite.com
DTSTAMP:${start}
DTSTART:${start}
DTEND:${end}
SUMMARY:${event.artist} — ${event.title}
LOCATION:${event.museum}, ${event.city} (${event.country.cca2})
END:VEVENT
END:VCALENDAR
  `.trim();

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `${event.artist}-${event.title}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
