/**
 * Archive filename stamping for ts-audit reports.
 *
 * Seconds are part of the stamp (not just minutes): two runs in the same
 * minute — e.g. a schedule tick plus a manual dispatch — must not collide
 * on the same archive filename.
 */

// "2026-11-27T09:41:52.123Z" → "2026-11-27T09-41-52" (filename-safe)
export function archiveStamp(iso) {
	return iso.slice(0, 19).replaceAll(":", "-");
}
