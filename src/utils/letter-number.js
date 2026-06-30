import { toRomanMonth } from "@/utils/date";

const COUNTER_KEY = "simpoi.letterCounters";

/**
 * Get all saved letter counters from localStorage.
 * Returns an object keyed by `{templateCode}-{year}-{month}`.
 */
function getCounters() {
  try {
    const raw = window.localStorage.getItem(COUNTER_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCounters(counters) {
  window.localStorage.setItem(COUNTER_KEY, JSON.stringify(counters));
}

/**
 * Get the next auto-increment number for a template code in a given month/year.
 * @param {string} templateCode - e.g. "SKTM", "UNDANGAN"
 * @param {Date} [date] - defaults to now
 * @returns {number} The next sequential number
 */
export function getNextLetterNumber(templateCode, date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const counterKey = `${templateCode}-${year}-${month}`;
  const counters = getCounters();
  const next = (counters[counterKey] ?? 0) + 1;

  counters[counterKey] = next;
  saveCounters(counters);

  return next;
}

/**
 * Peek at the next number without incrementing.
 * @param {string} templateCode
 * @param {Date} [date]
 * @returns {number}
 */
export function peekNextLetterNumber(templateCode, date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const counterKey = `${templateCode}-${year}-${month}`;
  const counters = getCounters();

  return (counters[counterKey] ?? 0) + 1;
}

/**
 * Generate a formatted letter number.
 *
 * Format tokens:
 *   {nomor}       → sequential number (zero-padded to 3 digits)
 *   {kode}        → template code (e.g. "SKTM")
 *   {kode_instansi} → institution prefix from settings
 *   {bulan}       → Roman numeral month
 *   {tahun}       → 4-digit year
 *
 * @param {object} options
 * @param {string} options.format - e.g. "{nomor}/{kode}/{kode_instansi}/{bulan}/{tahun}"
 * @param {string} options.templateCode
 * @param {string} [options.institutionCode] - prefix from settings
 * @param {Date}   [options.date]
 * @param {boolean} [options.autoIncrement] - if true, increments the counter
 * @returns {string}
 */
export function generateLetterNumber({
  format = "{nomor}/{kode}/{kode_instansi}/{bulan}/{tahun}",
  templateCode,
  institutionCode = "",
  date = new Date(),
  autoIncrement = true,
} = {}) {
  const sequentialNumber = autoIncrement
    ? getNextLetterNumber(templateCode, date)
    : peekNextLetterNumber(templateCode, date);

  const paddedNumber = String(sequentialNumber).padStart(3, "0");
  const month = date.getMonth() + 1;
  const romanMonth = toRomanMonth(month);
  const year = date.getFullYear();

  return format
    .replace("{nomor}", paddedNumber)
    .replace("{kode}", templateCode)
    .replace("{kode_instansi}", institutionCode)
    .replace("{bulan}", romanMonth)
    .replace("{tahun}", String(year));
}

/**
 * Reset the counter for a specific template code and month/year.
 * @param {string} templateCode
 * @param {Date} [date]
 */
export function resetLetterCounter(templateCode, date = new Date()) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const counterKey = `${templateCode}-${year}-${month}`;
  const counters = getCounters();

  delete counters[counterKey];
  saveCounters(counters);
}
