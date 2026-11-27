/**
 * Pure README splicing: keep a live audit summary between stable HTML-comment
 * markers so a daily job can refresh it without committing noise when
 * nothing changed.
 */

export const SECTION_START = "<!-- ts-audit:start -->";
export const SECTION_END = "<!-- ts-audit:end -->";

// Anchor for first-time insertion. If this heading ever disappears from the
// README, the section falls back to end-of-file (still marker-delimited).
const INSERT_BEFORE_HEADING = "## Machine requirements (portability)";

function wrap(section) {
	return `${SECTION_START}\n${section.trimEnd()}\n${SECTION_END}`;
}

/**
 * Replace the content between the audit markers, or insert the marked block
 * for the first time. Idempotent: splicing the same section twice yields the
 * same output.
 *
 * @param readme {string} current README content
 * @param section {string} Markdown body (without markers)
 * @returns {string} new README content
 */
export function spliceAuditSection(readme, section) {
	const marked = wrap(section);
	const start = readme.indexOf(SECTION_START);
	const end = readme.indexOf(SECTION_END);

	if (start !== -1 && end !== -1 && start < end) {
		return readme.slice(0, start) + marked + readme.slice(end + SECTION_END.length);
	}

	const headingIndex = readme.indexOf(`\n${INSERT_BEFORE_HEADING}`);
	if (headingIndex !== -1) {
		return readme.slice(0, headingIndex) + `\n${marked}\n` + readme.slice(headingIndex + 1);
	}

	return `${readme.trimEnd()}\n\n${marked}\n`;
}
