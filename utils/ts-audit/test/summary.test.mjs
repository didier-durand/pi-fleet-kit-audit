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

const RESULTS = [
	{
		filePath: "/repo/extensions/a.ts",
		messages: [{ ruleId: "r-a", severity: 2, line: 3, column: 1, message: "bad" }],
	},
];

test("json-to-md formatter: renders full report from results + injected meta", () => {
	const md = jsonToMd(RESULTS, { cwd: "/repo", ...META });
	assert.match(md, /# TypeScript audit — security & efficiency/);
	assert.match(md, /Generated: 2026-11-27T09:41:52\.123Z/);
	assert.match(md, /commit: `abc1234`/);
	assert.match(md, /eslint: 10\.15\.0/);
	assert.match(md, /### extensions\/a\.ts/);
	assert.match(md, /\| Errors \| 1 \|/);
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

test("toJobSummary: compact — has tables, no per-file findings", () => {
	const s = toJobSummary(RESULTS, META);
	assert.match(s, /## TypeScript audit — security & efficiency/);
	assert.match(s, /\| Errors \| 1 \|/);
	assert.match(s, /- `r-a`: 1/);
	assert.doesNotMatch(s, /## Findings/);
	assert.match(s, /docs\/audits\/ts-audit\.md/);
});

test("toJobSummary: clean state shows explicit no-findings line", () => {
	const s = toJobSummary([{ filePath: "/repo/a.ts", messages: [] }], META);
	assert.match(s, /No findings/);
});
