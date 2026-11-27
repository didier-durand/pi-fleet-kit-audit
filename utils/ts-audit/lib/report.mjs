/**
 * Pure report formatting: ESLint result objects → Markdown.
 * No filesystem, no clock: metadata is injected, which keeps this
 * deterministic and unit-testable.
 */

const SEVERITY_LABEL = { 1: "warning", 2: "error" };

/** ESLint result: { filePath, messages: [{ruleId, severity, line, column, message}] } */
export function summarize(results) {
	let errors = 0;
	let warnings = 0;
	const ruleCounts = new Map();
	let filesWithFindings = 0;

	for (const result of results) {
		let fileHasFindings = false;
		for (const message of result.messages) {
			if (message.severity === 2) errors++;
			else warnings++;
			fileHasFindings = true;
			ruleCounts.set(message.ruleId ?? "(internal)", (ruleCounts.get(message.ruleId ?? "(internal)") ?? 0) + 1);
		}
		if (fileHasFindings) filesWithFindings++;
	}

	return {
		files: results.length,
		filesWithFindings,
		errors,
		warnings,
		rules: [...ruleCounts.entries()]
			.sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
			.map(([rule, count]) => ({ rule, count })),
	};
}

function relativePath(filePath, root) {
	return filePath.startsWith(root) ? filePath.slice(root.length + 1) : filePath;
}

function findingTable(messages, root, filePath) {
	const rows = [...messages]
		.sort((a, b) => a.line - b.line || a.column - b.column)
		.map((m) => {
			const severity = SEVERITY_LABEL[m.severity] ?? `severity:${m.severity}`;
			const rule = m.ruleId ?? "(internal)";
			// Escape pipes so table cells never break the Markdown column layout.
			const text = m.message.replaceAll("|", "\\|");
			return `| ${m.line}:${m.column} | ${severity} | \`${rule}\` | ${text} |`;
		});
	return [`### ${relativePath(filePath, root)}`, "", "| Line:Col | Severity | Rule | Message |", "|---|---|---|---|", ...rows, ""];
}

/**
 * Compact variant for the GitHub job summary ($GITHUB_STEP_SUMMARY):
 * headline + summary table + top rules — no per-finding tables (the full
 * report stays in docs/audits/).
 *
 * @param results {Array} ESLint lint results
 * @param meta {{generatedAt: string, commit: string, eslintVersion: string}}
 * @returns {string} Markdown for the job summary
 */
export function toJobSummary(results, meta) {
	const s = summarize(results);
	const topRules =
		s.rules
			.slice(0, 10)
			.map(({ rule, count }) => `- \`${rule}\`: ${count}`)
			.join("\n") || "- none";
	const lines = [
		"## TypeScript audit — security & efficiency",
		"",
		`Generated: ${meta.generatedAt} · commit: \`${meta.commit}\` · eslint: ${meta.eslintVersion}`,
		"",
		"| Metric | Value |",
		"|---|---|",
		`| Errors | ${s.errors} |`,
		`| Warnings | ${s.warnings} |`,
		`| Files scanned | ${s.files} |`,
		`| Files with findings | ${s.filesWithFindings} |`,
		`| Rules triggered | ${s.rules.length} |`,
		"",
	];
	if (s.errors === 0 && s.warnings === 0) lines.push("✅ **No findings.**", "");
	lines.push("## Top rules", "", topRules, "");
	lines.push("Full report: `docs/audits/ts-audit.md` (latest) · timestamped archives alongside.");
	return lines.join("\n");
}

/**
 * @param results {Array} ESLint lint results
 * @param meta {{generatedAt: string, commit: string, eslintVersion: string, root: string}}
 * @returns {string} full Markdown report
 */
export function toMarkdown(results, meta) {
	const s = summarize(results);
	const head = [
		"# TypeScript audit — security & efficiency",
		"",
		`Generated: ${meta.generatedAt} · commit: \`${meta.commit}\` · eslint: ${meta.eslintVersion}`,
		"",
		"Scope: `extensions/**/*.ts`. Rules: typescript-eslint (strict, type-checked),",
		"eslint-plugin-security, eslint-plugin-regexp (ReDoS), eslint-plugin-sonarjs.",
		"",
		"## Summary",
		"",
		"| Metric | Value |",
		"|---|---|",
		`| Errors | ${s.errors} |`,
		`| Warnings | ${s.warnings} |`,
		`| Files scanned | ${s.files} |`,
		`| Files with findings | ${s.filesWithFindings} |`,
		`| Rules triggered | ${s.rules.length} |`,
		"",
	];

	if (s.errors === 0 && s.warnings === 0) {
		return [...head, "✅ **No findings.**", ""].join("\n");
	}

	const topRules = s.rules
		.slice(0, 10)
		.map(({ rule, count }) => `- \`${rule}\`: ${count}`)
		.join("\n");

	const byFile = results
		.filter((r) => r.messages.length > 0)
		.sort((a, b) => a.filePath.localeCompare(b.filePath))
		.flatMap((r) => findingTable(r.messages, meta.root, r.filePath));

	return [
		...head,
		"## Findings",
		"",
		byFile.join("\n"),
		"## Top rules",
		"",
		topRules,
		"",
	].join("\n");
}
