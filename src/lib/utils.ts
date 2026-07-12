import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTableShortCode(tableStr: string | null | undefined): string {
  if (!tableStr) return "";
  
  // Format is usually "Zone Name - Label Number" (e.g., "Main Floor - Table 1")
  if (tableStr.includes(" - ")) {
    const parts = tableStr.split(" - ");
    const zone = parts[0].trim();
    const label = parts[1].trim();
    
    // 1st letter of zone
    const zoneInitial = zone.charAt(0).toUpperCase();
    
    // 1st letter of label + any numbers in label
    const labelInitial = label.charAt(0).toUpperCase();
    const numbersMatch = label.match(/\d+/);
    const labelNumber = numbersMatch ? numbersMatch[0] : "";
    
    return `${zoneInitial}${labelInitial}${labelNumber}`;
  }
  
  // If it doesn't have a dash, try to abbreviate if it's "Table 1" -> "T1"
  const labelInitial = tableStr.charAt(0).toUpperCase();
  const numbersMatch = tableStr.match(/\d+/);
  if (numbersMatch) {
    return `${labelInitial}${numbersMatch[0]}`;
  }
  
  return tableStr.substring(0, 4).toUpperCase();
}

export function formatOrderNumber(
  tableStr: string | null | undefined, 
  dailyOrderNumber: number | null | undefined,
  createdAtString?: string | null,
  restaurantId?: string | null,
  restaurantCreatedAt?: string | null
): string {
  // Use restaurant creation date as the epoch if provided, otherwise fallback to Jan 1, 2024
  const epoch = restaurantCreatedAt ? new Date(restaurantCreatedAt).getTime() : new Date('2024-01-01T00:00:00Z').getTime();
  
  // Use provided createdAt, or current time if not provided
  const orderTime = createdAtString ? new Date(createdAtString).getTime() : Date.now();
  
  // Calculate days since epoch
  const daysSinceEpoch = Math.floor((orderTime - epoch) / (1000 * 60 * 60 * 24));
  
  // Calculate restaurant offset (only use this if we don't have the exact restaurant install date, to preserve backwards compatibility)
  let offset = 0;
  if (restaurantId && !restaurantCreatedAt) {
    offset = Array.from(restaurantId).reduce((acc, char) => acc + char.charCodeAt(0), 0) % 26;
  }
  
  // 26 letters in English alphabet
  const letterIndex = Math.max(0, daysSinceEpoch + offset) % 26;
  const dayLetter = String.fromCharCode(65 + letterIndex); // A-Z

  const shortCode = getTableShortCode(tableStr);
  const paddedOrderNum = String(dailyOrderNumber || 0).padStart(3, '0');
  
  const formattedNumber = `${dayLetter}${paddedOrderNum}`;

  if (shortCode) {
    return `${shortCode}-${formattedNumber}`;
  }
  return formattedNumber;
}
