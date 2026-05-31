export interface TimezoneOption {
  code: string;
  name: string;
}

export const TIMEZONE_OPTIONS: TimezoneOption[] = [
  // North America
  { code: "America/New_York", name: "Eastern Time (US & Canada)" },
  { code: "America/Chicago", name: "Central Time (US & Canada)" },
  { code: "America/Denver", name: "Mountain Time (US & Canada)" },
  { code: "America/Los_Angeles", name: "Pacific Time (US & Canada)" },
  { code: "America/Toronto", name: "Toronto (EST/EDT)" },
  { code: "America/Vancouver", name: "Vancouver (PST/PDT)" },
  { code: "America/Mexico_City", name: "Mexico City (CST/CDT)" },
  
  // South America
  { code: "America/Sao_Paulo", name: "São Paulo (BRT/BRST)" },
  { code: "America/Argentina/Buenos_Aires", name: "Buenos Aires (ART)" },
  { code: "America/Santiago", name: "Santiago (CLT/CLST)" },
  { code: "America/Bogota", name: "Bogotá (COT)" },
  { code: "America/Lima", name: "Lima (PET)" },

  // Europe
  { code: "Europe/London", name: "London (GMT/BST)" },
  { code: "Europe/Paris", name: "Paris (CET/CEST)" },
  { code: "Europe/Berlin", name: "Berlin (CET/CEST)" },
  { code: "Europe/Madrid", name: "Madrid (CET/CEST)" },
  { code: "Europe/Rome", name: "Rome (CET/CEST)" },
  { code: "Europe/Amsterdam", name: "Amsterdam (CET/CEST)" },
  { code: "Europe/Stockholm", name: "Stockholm (CET/CEST)" },
  { code: "Europe/Oslo", name: "Oslo (CET/CEST)" },
  { code: "Europe/Copenhagen", name: "Copenhagen (CET/CEST)" },
  { code: "Europe/Warsaw", name: "Warsaw (CET/CEST)" },
  { code: "Europe/Prague", name: "Prague (CET/CEST)" },
  { code: "Europe/Budapest", name: "Budapest (CET/CEST)" },
  { code: "Europe/Bucharest", name: "Bucharest (EET/EEST)" },
  { code: "Europe/Zurich", name: "Zurich (CET/CEST)" },

  // Asia
  { code: "Asia/Kolkata", name: "India Standard Time (IST)" },
  { code: "Asia/Shanghai", name: "China Standard Time (CST)" },
  { code: "Asia/Tokyo", name: "Japan Standard Time (JST)" },
  { code: "Asia/Seoul", name: "Korea Standard Time (KST)" },
  { code: "Asia/Singapore", name: "Singapore Time (SGT)" },
  { code: "Asia/Hong_Kong", name: "Hong Kong Time (HKT)" },
  { code: "Asia/Taipei", name: "Taipei Time (CST)" },
  { code: "Asia/Kuala_Lumpur", name: "Malaysia Time (MYT)" },
  { code: "Asia/Bangkok", name: "Indochina Time (ICT)" },
  { code: "Asia/Jakarta", name: "Western Indonesia Time (WIB)" },
  { code: "Asia/Manila", name: "Philippine Time (PHT)" },
  { code: "Asia/Ho_Chi_Minh", name: "Indochina Time (ICT)" },

  // Middle East
  { code: "Asia/Dubai", name: "Gulf Standard Time (GST)" },
  { code: "Asia/Riyadh", name: "Arabia Standard Time (AST)" },
  { code: "Asia/Qatar", name: "Arabia Standard Time (AST)" },
  { code: "Asia/Kuwait", name: "Arabia Standard Time (AST)" },
  { code: "Asia/Muscat", name: "Gulf Standard Time (GST)" },
  { code: "Asia/Bahrain", name: "Arabia Standard Time (AST)" },
  { code: "Asia/Jerusalem", name: "Israel Standard Time (IST)" },

  // Oceania
  { code: "Australia/Sydney", name: "Sydney (AEST/AEDT)" },
  { code: "Australia/Melbourne", name: "Melbourne (AEST/AEDT)" },
  { code: "Australia/Brisbane", name: "Brisbane (AEST)" },
  { code: "Australia/Perth", name: "Perth (AWST)" },
  { code: "Pacific/Auckland", name: "Auckland (NZST/NZDT)" },

  // Africa
  { code: "Africa/Johannesburg", name: "South Africa Standard Time (SAST)" },
  { code: "Africa/Cairo", name: "Egypt Standard Time (EGT)" },
  { code: "Africa/Lagos", name: "West Africa Time (WAT)" },
  { code: "Africa/Nairobi", name: "East Africa Time (EAT)" },
  { code: "Africa/Casablanca", name: "Western European Time (WET)" },
  { code: "Africa/Accra", name: "Greenwich Mean Time (GMT)" },

  // UTC
  { code: "UTC", name: "UTC / Universal Time" },
];
