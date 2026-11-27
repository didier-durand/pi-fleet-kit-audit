import assert from "node:assert/strict";
import test from "node:test";

import { summarize, toMarkdown } from "../lib/report.mjs";

const ROOT = "/repo";
const META = {
	generatedAt: "2026-11-24T04:00:00.000Z",
	commit: "abc1234",
	eslintVersion: "9.0.0",
	root: ROOT,
};

function result(file, messages) {
	return { filePath: `${ROOT}/${file}`, messages };
}

test("summarize: clean results count zero findings", () => {
	const s = summarize([result("a.ts", []), result("b.ts", [])]);
	assert.deepEqual(s, { files: 2, filesWithFindings: 0, errors: 0, warnings: 0, rules: [] });
});

test("summarize: counts errors and warnings separately", () => {
	const s = summarize([
		result("a.ts", [
			{ ruleId: "rule-a", severity: 2, line: 1, column: 1, message: "x" },
			{ ruleId: "rule-b", severity: 1, line: 2, column: 1, message: "y" },
		]),
		result("b.ts", [{ ruleId: "rule-a", severity: 2, line: 9, column: 3, message: "z" }]),
	]);
	assert.equal(s.errors, 2);
	assert.equal(s.warnings, 1);
	assert.equal(s.filesWithFindings, 2);
	assert.deepEqual(s.rules, [
		{ rule: "rule-a", count: 2 },
		{ rule: "rule-b", count: 1 },
	]);
});

test("summarize: internal messages (no ruleId) bucket as (internal)", () => {
	const s = summarize([result("a.ts", [{ ruleId: null, severity: 2, line: 1, column: 1, message: "parse" }])]);
	assert.deepEqual(s.rules, [{ rule: "(internal)", count: 1 }]);
});

test("toMarkdown: clean state says so explicitly", () => {
	const md = toMarkdown([result("a.ts", [])], META);
	assert.match(md, /No findings/);
	assert.match(md, /\| Errors \| 0 \|/);
	assert.match(md, /Generated: 2026-11-24T04:00:00\.000Z/);
	assert.match(md, /commit: `abc1234`/);
});

test("toMarkdown: findings grouped per file, sorted by position, table-safe", () => {
	const md = toMarkdown(
		[
			result("b.ts", [{ ruleId: "r-b", severity: 1, line: 5, column: 2, message: "later" }]),
			result("a.ts", [
				{ ruleId: "r-a", severity: 2, line: 10, column: 1, message: "bad | pipe" },
				{ ruleId: "r-a", severity: 2, line: 3, column: 1, message: "early" },
			]),
		],
		META,
	);

	const fileA = md.indexOf("### a.ts");
	const fileB = md.indexOf("### b.ts");
	assert.ok(fileA !== -1 && fileB !== -1 && fileA < fileB, "files sorted by path");
	assert.ok(md.indexOf("| 3:1") < md.indexOf("| 10:1"), "findings sorted by line within file");
	assert.match(md, /bad \\\| pipe/, "pipe escaped for table safety");
	assert.match(md, /\| error \|/);
	assert.match(md, /\| warning \|/);
});

test("toMarkdown: relative paths, no absolute leakage", () => {
	const md = toMarkdown([result("src/x.ts", [{ ruleId: "r", severity: 1, line: 1, column: 1, message: "m" }])], META);
	assert.match(md, /### src\/x\.ts/);
	assert.doesNotMatch(md, /\/repo\//);
});
