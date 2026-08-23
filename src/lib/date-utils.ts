import { formatInTimeZone, toZonedTime, fromZonedTime } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";

export function safeToZonedTime(date: Date | string | number, timezone: string | null | undefined): Date {
  const tz = timezone || "UTC";
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date();
  try {
    const zoned = toZonedTime(d, tz);
    if (isNaN(zoned.getTime())) return d;
    return zoned;
  } catch (error) {
    return d;
  }
}

export function safeFromZonedTime(date: Date | string | number, timezone: string | null | undefined): Date {
  const tz = timezone || "UTC";
  const d = new Date(date);
  if (isNaN(d.getTime())) return new Date();
  try {
    const fromZoned = fromZonedTime(d, tz);
    if (isNaN(fromZoned.getTime())) return d;
    return fromZoned;
  } catch (error) {
    return d;
  }
}

export function formatTimezone(dateString: string | null | undefined, timezone: string | null | undefined, formatStr: string = "MMM d, yyyy 'at' h:mm a"): string {
  if (!dateString) return "Unknown date";
  
  const date = new Date(dateString);
  const tz = timezone || "UTC";

  try {
    return formatInTimeZone(date, tz, formatStr);
  } catch (error) {
    // Fallback if timezone string is invalid
    console.error("Invalid timezone:", tz);
    return formatInTimeZone(date, "UTC", formatStr) + " (UTC)";
  }
}

export function formatTimeAgoWithExact(dateString: string | null | undefined, timezone: string | null | undefined): string {
  if (!dateString) return "Unknown date";
  
  const date = new Date(dateString);
  let timeAgo = formatDistanceToNow(date, { addSuffix: false });
  
  if (timeAgo.includes('less than a minute')) {
    timeAgo = 'Just now';
  } else {
    timeAgo = timeAgo
      .replace(/about |almost |over /g, '')
      .replace(/ minutes?/g, 'min')
      .replace(/ hours?/g, 'h')
      .replace(/ days?/g, 'd')
      .replace(/ months?/g, 'mo')
      .replace(/ years?/g, 'y') + ' ago';
  }

  const exactTime = formatTimezone(dateString, timezone);

  return `${timeAgo} (${exactTime})`;
}

