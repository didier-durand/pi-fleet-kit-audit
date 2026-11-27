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
 * Split lint results into audit scopes. Test files get their own scope so
 * the report can show them separately from functional code:
 * - functional: everything else (shipped extension code)
 * - tests: `tests/` directories and `*.test.ts` files
 */
export function splitByScope(results) {
	const isTest = (filePath) => /(^|\/)tests\/|\.test\.tsx?$/.test(filePath);
	return {
		functional: results.filter((r) => !isTest(r.filePath)),
		tests: results.filter((r) => isTest(r.filePath)),
	};
}

const SCOPES = [
	{ key: "functional", label: "Functional code" },
	{ key: "tests", label: "Tests" },
];

function scopeSummaryTable(results) {
	const s = summarize(results);
	return {
		s,
		rows: [
			"| Metric | Value |",
			"|---|---|",
			`| Errors | ${s.errors} |`,
			`| Warnings | ${s.warnings} |`,
			`| Files scanned | ${s.files} |`,
			`| Files with findings | ${s.filesWithFindings} |`,
			`| Rules triggered | ${s.rules.length} |`,
		],
	};
}

function topRulesList(s) {
	return (
		s.rules
			.slice(0, 10)
			.map(({ rule, count }) => `- \`${rule}\`: ${count}`)
			.join("\n") || "- none"
	);
}

function findingsSection(results, label, root) {
	const withFindings = results
		.filter((r) => r.messages.length > 0)
		.sort((a, b) => a.filePath.localeCompare(b.filePath));
	if (withFindings.length === 0) return [`## Findings — ${label}`, "", "✅ **No findings.**", ""];
	return [
		`## Findings — ${label}`,
		"",
		...withFindings.flatMap((r) => findingTable(r.messages, root, r.filePath)),
	];
}

/**
 * Rule-frequency totals across both scopes, as one table with a column per
 * scope. Ordered by FUNCTIONAL-code frequency descending (tie-break: tests
 * frequency, then rule name) — the functional signal leads the ranking.
 *
 * @param scopes {{functional: Array, tests: Array}}
 * @param heading {"##" | "###"} — section level: "##" in the full report,
 *   "###" inside the job summary (where scope metrics are already "##").
 */
export function ruleTotalsTable(scopes, heading) {
	const counts = new Map(); // rule → { functional, tests }
	for (const { key, label } of SCOPES) {
		for (const { rule, count } of summarize(scopes[key]).rules) {
			const entry = counts.get(rule) ?? { functional: 0, tests: 0 };
			entry[key] = count;
			counts.set(rule, entry);
		}
	}
	if (counts.size === 0) return null;
	const sorted = [...counts.entries()]
		.map(([rule, c]) => ({ rule, ...c }))
		.sort((a, b) => b.functional - a.functional || b.tests - a.tests || a.rule.localeCompare(b.rule));
	return [
		`${heading} Totals per rule`,
		"",
		"| Rule | Functional code | Tests |",
		"|---|---|---|",
		...sorted.map(({ rule, functional, tests }) => `| \`${rule}\` | ${functional} | ${tests} |`),
	];
}

/**
 * Compact variant for the GitHub job summary ($GITHUB_STEP_SUMMARY):
 * one metrics section per scope (functional code / tests), each with its
 * own columns, then a second table — totals per rule, split by scope and
 * ordered by functional frequency. No per-finding tables (the full report
 * stays in audits/).
 *
 * @param scopes {{functional: Array, tests: Array}} from splitByScope()
 * @param meta {{generatedAt: string, commit: string, eslintVersion: string}}
 * @returns {string} Markdown for the job summary
 */
export function toJobSummary(scopes, meta) {
	const lines = [
		"## TypeScript audit — security & efficiency",
		"",
		`Generated: ${meta.generatedAt} · commit: \`${meta.commit}\` · eslint: ${meta.eslintVersion}`,
		"",
	];
	for (const { key, label } of SCOPES) {
		const { s, rows } = scopeSummaryTable(scopes[key]);
		lines.push(`### ${label}`, "", ...rows, "");
		if (s.errors === 0 && s.warnings === 0) lines.push("✅ **No findings.**", "");
	}
	const totals = ruleTotalsTable(scopes, "###");
	if (totals) lines.push(...totals, "");
	else lines.push("_No rule totals — nothing to report._", "");
	lines.push("Archives: `audits/` — one Markdown report per run (name = date + hh-mm-ss).");
	return lines.join("\n");
}

/**
 * Live README section: status line (emoji + date + link to the run's full
 * report archive), then the Summary and Totals per rule tables — the same
 * data as the job summary, in a more compact shape.
 *
 * @param scopes {{functional: Array, tests: Array}} from splitByScope()
 * @param meta {{generatedAt: string, commit: string, eslintVersion: string}}
 * @param archiveRel {string} repo-relative path of this run's archive
 * @returns {string} Markdown between the ts-audit markers
 */
export function toReadmeSection(scopes, meta, archiveRel) {
	const statusDate = `${meta.generatedAt.slice(0, 16).replace("T", " ")} UTC`;
	const lines = [
		"## TypeScript audit",
		"",
		`📅 **Status as of ${statusDate}** · commit \`${meta.commit}\` · 📄 [full report](${archiveRel})`,
		"",
		"### Summary",
		"",
		...scopeSummaryTableCombined(scopes),
		"",
	];
	const totals = ruleTotalsTable(scopes, "###");
	if (totals) lines.push(...totals, "");
	return lines.join("\n");
}

/**
 * Full report covering BOTH scopes: combined summary table (one row per
 * scope), then per-scope findings and top rules.
 *
 * @param scopes {{functional: Array, tests: Array}} from splitByScope()
 * @param meta {{generatedAt: string, commit: string, eslintVersion: string, root: string}}
 * @returns {string} full Markdown report
 */
/**
 * Combined Summary table (one row per scope) — shared by the full report
 * and the README section.
 */
function scopeSummaryTableCombined(scopes) {
	const rows = [
		"| Scope | Errors | Warnings | Files scanned | Files with findings | Rules triggered |",
		"|---|---|---|---|---|---|",
	];
	for (const { key, label } of SCOPES) {
		const { s } = scopeSummaryTable(scopes[key]);
		rows.push(`| ${label} | ${s.errors} | ${s.warnings} | ${s.files} | ${s.filesWithFindings} | ${s.rules.length} |`);
	}
	return rows;
}

export function toMarkdownScopes(scopes, meta) {
	const parts = [
		"# TypeScript audit — security & efficiency",
		"",
		`Generated: ${meta.generatedAt} · commit: \`${meta.commit}\` · eslint: ${meta.eslintVersion}`,
		"",
		"Scope: `extensions/**/*.ts`. Rules: typescript-eslint (strict, type-checked),",
		"eslint-plugin-security, eslint-plugin-regexp (ReDoS), eslint-plugin-sonarjs.",
		"",
		"## Summary",
		"",
		...scopeSummaryTableCombined(scopes),
	];
	// Rule totals lead the findings sections — same table as the job summary.
	const totals = ruleTotalsTable(scopes, "##");
	if (totals) parts.push(...totals, "");
	for (const { key, label } of SCOPES) {
		parts.push(
			...findingsSection(scopes[key], label, meta.root),
			`## Top rules — ${label}`,
			"",
			topRulesList(summarize(scopes[key])),
			"",
		);
	}
	return parts.join("\n");
}

/**
 * Single-scope report renderer (the scope split lives in toMarkdownScopes).
 *
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
