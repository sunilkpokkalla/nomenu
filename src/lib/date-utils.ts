import { formatInTimeZone } from "date-fns-tz";
import { formatDistanceToNow } from "date-fns";

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
  const timeAgo = formatDistanceToNow(date, { addSuffix: true });
  const exactTime = formatTimezone(dateString, timezone);

  return `${timeAgo} (${exactTime})`;
}
