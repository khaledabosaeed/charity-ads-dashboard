/** Eastern and Persian digits → Latin, so a typed "١٢٣" is stored as "123". */
const ARABIC_DIGIT: Record<string, string> = {
  "٠": "0",
  "١": "1",
  "٢": "2",
  "٣": "3",
  "٤": "4",
  "٥": "5",
  "٦": "6",
  "٧": "7",
  "٨": "8",
  "٩": "9",
  "۰": "0",
  "۱": "1",
  "۲": "2",
  "۳": "3",
  "۴": "4",
  "۵": "5",
  "۶": "6",
  "۷": "7",
  "۸": "8",
  "۹": "9",
};

function toLatinDigits(value: string): string {
  return value.replace(/[٠-٩۰-۹]/g, (d) => ARABIC_DIGIT[d] ?? d);
}

/** Amounts: digits and at most one decimal point. Strips letters, signs, `e`. */
export function sanitizeDecimalInput(value: string): string {
  const latin = toLatinDigits(value).replace(/٫/g, ".").replace(/,/g, "");
  let out = "";
  let seenDot = false;
  for (const ch of latin) {
    if (ch >= "0" && ch <= "9") out += ch;
    else if (ch === "." && !seenDot) {
      out += ".";
      seenDot = true;
    }
  }
  return out;
}

/** Counts: digits only. */
export function sanitizeIntegerInput(value: string): string {
  return toLatinDigits(value).replace(/\D/g, "");
}
