export interface CurrencyOption {
  code: string;
  symbol: string;
  name: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", symbol: "$", name: "USD - US Dollar ($)" },
  { code: "EUR", symbol: "€", name: "EUR - Euro (€)" },
  { code: "GBP", symbol: "£", name: "GBP - British Pound (£)" },
  { code: "CAD", symbol: "CA$", name: "CAD - Canadian Dollar (CA$)" },
  { code: "AUD", symbol: "A$", name: "AUD - Australian Dollar (A$)" },
  { code: "INR", symbol: "₹", name: "INR - Indian Rupee (₹)" },
  { code: "JPY", symbol: "¥", name: "JPY - Japanese Yen (¥)" },
  { code: "MXN", symbol: "MX$", name: "MXN - Mexican Peso (MX$)" },
  { code: "BRL", symbol: "R$", name: "BRL - Brazilian Real (R$)" },
  { code: "CHF", symbol: "CHF", name: "CHF - Swiss Franc (CHF)" },
  { code: "CNY", symbol: "CN¥", name: "CNY - Chinese Yuan (CN¥)" },
  { code: "SGD", symbol: "S$", name: "SGD - Singapore Dollar (S$)" },
  { code: "NZD", symbol: "NZ$", name: "NZD - New Zealand Dollar (NZ$)" },
  { code: "HKD", symbol: "HK$", name: "HKD - Hong Kong Dollar (HK$)" },
  { code: "AED", symbol: "AED", name: "AED - UAE Dirham (AED)" },
  { code: "SAR", symbol: "SAR", name: "SAR - Saudi Riyal (SAR)" },
  { code: "ZAR", symbol: "ZAR", name: "ZAR - South African Rand (R)" },
  { code: "TRY", symbol: "₺", name: "TRY - Turkish Lira (₺)" },
  { code: "SEK", symbol: "kr", name: "SEK - Swedish Krona (kr)" },
  { code: "NOK", symbol: "kr", name: "NOK - Norwegian Krone (kr)" },
  { code: "DKK", symbol: "kr", name: "DKK - Danish Krone (kr)" },
  { code: "PLN", symbol: "zł", name: "PLN - Polish Zloty (zł)" },
];
