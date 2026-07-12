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

export function formatOrderNumber(tableStr: string | null | undefined, dailyOrderNumber: number | null | undefined): string {
  const shortCode = getTableShortCode(tableStr);
  const paddedOrderNum = String(dailyOrderNumber || 0).padStart(3, '0');
  
  if (shortCode) {
    return `${shortCode}-${paddedOrderNum}`;
  }
  return paddedOrderNum;
}
