import assert from "node:assert/strict";
import test from "node:test";

// ESLint path-based formatters must export the format function as the module
// default; the named export is the same function for ergonomic imports.
import { format as jsonToMd } from "../formatters/json-to-md.mjs";
import defaultFormat from "../formatters/json-to-md.mjs";
import { toJobSummary } from "../lib/report.mjs";

const META = {
	generatedAt: "2026-11-27T09:41:52.123Z",
	commit: "abc1234",
	eslintVersion: "10.15.0",
};

const RESULTS = {
	functional: [
		{
			filePath: "/repo/extensions/a.ts",
			messages: [{ ruleId: "r-a", severity: 2, line: 3, column: 1, message: "bad" }],
		},
	],
	tests: [
		{
			filePath: "/repo/extensions/a.test.ts",
			messages: [{ ruleId: "r-b", severity: 1, line: 7, column: 2, message: "meh" }],
		},
	],
};

test("json-to-md formatter: renders full report from results + injected meta", () => {
	const md = jsonToMd(RESULTS, { cwd: "/repo", ...META });
	assert.match(md, /# TypeScript audit — security & efficiency/);
	assert.match(md, /Generated: 2026-11-27T09:41:52\.123Z/);
	assert.match(md, /commit: `abc1234`/);
	assert.match(md, /eslint: 10\.15\.0/);
	assert.match(md, /### extensions\/a\.ts/);
	assert.match(md, /\| Functional code \| 1 \| 0 \|/);
	assert.match(md, /\| Tests \| 0 \| 1 \|/);
});

test("json-to-md formatter: falls back to env and clock without injected meta", () => {
	process.env.GIT_SHA = "envsha";
	const md = jsonToMd(RESULTS);
	assert.match(md, /commit: `envsha`/);
	assert.match(md, /Generated: \d{4}-\d{2}-\d{2}T/);
	delete process.env.GIT_SHA;
});

test("json-to-md formatter: default export is the bare format fn (ESLint contract)", () => {
	assert.equal(typeof defaultFormat, "function");
	assert.equal(defaultFormat, jsonToMd, "default and named export are the same function");
});

test("toJobSummary: metrics sections per scope + rule-totals table ordered by functional frequency", () => {
	const s = toJobSummary(RESULTS, META);
	assert.match(s, /## TypeScript audit — security & efficiency/);
	assert.match(s, /### Functional code/);
	assert.match(s, /### Tests/);
	assert.match(s, /\| Errors \| 1 \|/); // functional metrics table
	assert.match(s, /\| Warnings \| 1 \|/); // tests metrics table

	// second table: totals per rule, split by scope, ordered by functional desc
	assert.match(s, /### Totals per rule/);
	assert.match(s, /\| Rule \| Functional code \| Tests \|/);
	assert.match(s, /\| `r-a` \| 1 \| 0 \|/);
	assert.match(s, /\| `r-b` \| 0 \| 1 \|/);
	const iA = s.indexOf("| `r-a` |");
	const iB = s.indexOf("| `r-b` |");
	assert.ok(iA !== -1 && iB !== -1 && iA < iB, "functional frequency leads the ranking");

	assert.doesNotMatch(s, /## Findings/);
	assert.match(s, /docs\/audits\//);
	assert.doesNotMatch(s, /ts-audit\.md/, "no canonical-latest file — archives only");
});

test("toJobSummary: clean scopes show explicit no-findings lines and no totals table", () => {
	const s = toJobSummary(
		{ functional: [{ filePath: "/repo/a.ts", messages: [] }], tests: [] },
		META,
	);
	const sections = s.split("### ").slice(1);
	assert.equal(sections.length, 2, "two scope sections, no totals section");
	for (const section of sections) assert.match(section, /No findings/);
	assert.match(s, /No rule totals/);
});
