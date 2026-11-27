/**
 * Daily TypeScript security & efficiency audit for the fleet's extensions.
 *
 * Runs ESLint (typescript-eslint strictTypeChecked + security + regexp +
 * sonarjs) over every TypeScript file under <target>/extensions/, produces
 * the Markdown report via the json-to-md ESLint formatter, writes it to
 * audits/ (canonical latest + timestamped archive per run), emits a
 * GitHub job summary when running in Actions, and splices a summary
 * section into README.md between markers.
 *
 * Two roots:
 * - HOME_ROOT  (this repo): tool, reports, README — always the repo that
 *   contains this tool (../.. from this file).
 * - TARGET_ROOT (AUDIT_ROOT env): the code being audited. Defaults to
 *   HOME_ROOT; CI points it at a separate pi-fleet-kit checkout.
 *
 * Exit codes: 0 = audit ran (findings or not — the report is informational
 * and the summary table carries the status); >0 = infrastructure failure
 * (fatal parse errors, unwritable output). A failing audit never blocks the
 * report commit: the workflow continues on lint findings by design.
 */
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { ESLint } from "eslint";

import { archiveStamp } from "./lib/archive-stamp.mjs";
import { splitByScope, summarize, toJobSummary, toMarkdownScopes, toReadmeSection } from "./lib/report.mjs";
import { spliceAuditSection } from "./lib/readme.mjs";

const HOME_ROOT = path.resolve(import.meta.dirname, "../..");
// The audited tree: AUDIT_ROOT (a separate checkout) or, by default, the
// repo the tool lives in.
const TARGET_ROOT = process.env.AUDIT_ROOT ? path.resolve(process.env.AUDIT_ROOT) : HOME_ROOT;
const CONFIG = path.join(import.meta.dirname, "eslint.config.mjs");
const FORMATTER = path.join(import.meta.dirname, "formatters", "json-to-md.mjs");
const REPORT_DIR = path.join(HOME_ROOT, "audits");
// One timestamped archive per run (date AND time AND seconds, UTC) is the
// only report artifact — no duplicate "latest" copy.
const README = path.join(HOME_ROOT, "README.md");

// CI passes the exact commit being audited; local runs fall back to the
// target checkout's HEAD.
function currentCommit() {
	if (process.env.GIT_SHA) return process.env.GIT_SHA;
	try {
		return execFileSync("git", ["rev-parse", "--short", "HEAD"], { cwd: TARGET_ROOT }).toString().trim();
	} catch {
		return "(unknown)";
	}
}

/**
 * Type-aware linting needs a tsconfig covering the TARGET tree, but a
 * committed tsconfig's include paths would be relative to the tool's own
 * repo. Generate one per run beside the committed template (gitignored).
 */
function writeTargetTsconfig() {
	// The template is JSONC (commented for humans); JSON.parse needs it clean.
	const jsonc = fs.readFileSync(path.join(import.meta.dirname, "tsconfig.audit.json"), "utf8");
	const template = JSON.parse(jsonc.replace(/^\s*\/\/.*$/gm, ""));
	const rel = path.relative(import.meta.dirname, path.join(TARGET_ROOT, "extensions"));
	template.include = [path.join(rel, "**", "*"), "shims.d.ts"];
	const generated = path.join(import.meta.dirname, "tsconfig.audit.generated.json");
	fs.writeFileSync(generated, JSON.stringify(template, null, "\t") + "\n", "utf8");
	return generated;
}

async function main() {
	process.env.AUDIT_TSCONFIG = writeTargetTsconfig();
	const eslint = new ESLint({ cwd: TARGET_ROOT, overrideConfigFile: CONFIG });
	const results = await eslint.lintFiles(["extensions/**/*.ts"]);

	const fatal = results.flatMap((r) => r.messages.filter((m) => m.fatal));
	if (fatal.length > 0) {
		console.error("Fatal parse errors — audit cannot produce a trustworthy report:");
		for (const m of fatal) console.error(`  ${m.message}`);
		process.exitCode = 2;
		return;
	}

	const meta = {
		generatedAt: new Date().toISOString(),
		commit: currentCommit(),
		eslintVersion: ESLint.version,
		root: TARGET_ROOT,
	};

	// One lint pass, two scopes: shipped code vs test files, reported with
	// separate tables/columns each.
	const scopes = splitByScope(results);

	// The report is produced by the json-to-md ESLint formatter — the same
	// module `eslint --format json-to-md` would load. ESLint's wrapper only
	// accepts a flat results array; the formatter does the scope split itself.
	const formatter = await eslint.loadFormatter(FORMATTER);
	const md = formatter.format(results, meta);

	fs.mkdirSync(REPORT_DIR, { recursive: true });
	const archive = path.join(REPORT_DIR, `ts-audit-${archiveStamp(meta.generatedAt)}.md`);
	fs.writeFileSync(archive, md, "utf8");

	const readme = fs.readFileSync(README, "utf8");
	const summary = toReadmeSection(scopes, meta, path.relative(HOME_ROOT, archive));

	const updated = spliceAuditSection(readme, summary);
	if (updated !== readme) fs.writeFileSync(README, updated, "utf8");

	// GitHub job summary — the run page renders this as Markdown.
	if (process.env.GITHUB_STEP_SUMMARY) {
		fs.appendFileSync(
			process.env.GITHUB_STEP_SUMMARY,
			`${toJobSummary(scopes, meta)}\n\nArchive: \`${path.relative(HOME_ROOT, archive)}\`.\n`,
			"utf8",
		);
	}

	for (const { key, label } of [
		{ key: "functional", label: "functional code" },
		{ key: "tests", label: "tests" },
	]) {
		const s = summarize(scopes[key]);
		console.log(`${label}: ${s.errors} errors, ${s.warnings} warnings across ${s.files} files.`);
	}
	console.log(
		`Archive: ${path.relative(HOME_ROOT, archive)}` +
			(updated !== readme ? " · README section updated" : " · README unchanged"),
	);
}

main().catch((err) => {
	console.error(err);
	process.exitCode = 2;
});
