/**
 * Shared measurement helpers for the 2026 baseline / 2027 target key-result model.
 *
 * Values are stored as free text (they may carry units, "%", "CHF", ranges or
 * plain words), so every numeric read is best-effort and returns null when the
 * value cannot be interpreted as a number.
 */

/** Days after which a `current_as_of` date is considered stale. */
export const STALE_AFTER_DAYS = 90;

/** Baselines are due at the end of the 2026 baselining year. */
export const BASELINE_DUE_LABEL = "30.11.2026";

/**
 * Best-effort numeric parse of a free-text measurement value.
 * Handles thousand separators (space, apostrophe, comma), a trailing unit such
 * as "%" or "CHF", and comma decimals. Returns null when no number is present.
 */
export function parseMeasurementValue(raw: string | null | undefined): number | null {
  if (!raw) return null;
  const cleaned = raw
    .trim()
    .replace(/[’']/g, "")
    .replace(/\s/g, "")
    .replace(/[^0-9,.\-+]/g, "");
  if (!cleaned) return null;
  // If both separators appear, the last one is the decimal separator.
  let normalized = cleaned;
  const lastComma = cleaned.lastIndexOf(",");
  const lastDot = cleaned.lastIndexOf(".");
  if (lastComma > -1 && lastDot > -1) {
    normalized =
      lastComma > lastDot
        ? cleaned.replace(/\./g, "").replace(",", ".")
        : cleaned.replace(/,/g, "");
  } else if (lastComma > -1) {
    normalized = cleaned.replace(",", ".");
  }
  const n = Number(normalized);
  return Number.isFinite(n) ? n : null;
}

/**
 * Progress as (current − baseline) / (target − baseline), clamped to 0…1.
 * Returns null when any of the three values is non-numeric or when the target
 * equals the baseline (no measurable distance to travel).
 */
export function computeKrProgress(
  baseline: string,
  current: string,
  target: string,
): number | null {
  const b = parseMeasurementValue(baseline);
  const c = parseMeasurementValue(current);
  const t = parseMeasurementValue(target);
  if (b === null || c === null || t === null) return null;
  if (t === b) return null;
  const ratio = (c - b) / (t - b);
  if (!Number.isFinite(ratio)) return null;
  return Math.min(1, Math.max(0, ratio));
}

/** Formats an ISO date (YYYY-MM-DD) as the Swiss DD.MM.YYYY. */
export function formatSwissDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}.${m}.${y}`;
}

/** True when the "current" reading is older than STALE_AFTER_DAYS. */
export function isValueStale(asOf: string | null | undefined): boolean {
  if (!asOf) return false;
  const ts = Date.parse(asOf);
  if (Number.isNaN(ts)) return false;
  const ageDays = (Date.now() - ts) / 86_400_000;
  return ageDays > STALE_AFTER_DAYS;
}
