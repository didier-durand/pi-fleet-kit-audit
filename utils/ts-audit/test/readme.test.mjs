import assert from "node:assert/strict";
import test from "node:test";

import { SECTION_END, SECTION_START, spliceAuditSection } from "../lib/readme.mjs";

const README = "# pi-fleet-kit\n\nintro\n\n## Machine requirements (portability)\n\nbody\n";
const SECTION = "## TypeScript audit\n\n✅ No findings.";

test("spliceAuditSection: inserts before anchor heading on first run", () => {
	const out = spliceAuditSection(README, SECTION);
	assert.match(out, new RegExp(`${SECTION_START}[\\s\\S]*## TypeScript audit[\\s\\S]*${SECTION_END}`));
	const anchor = out.indexOf("## Machine requirements (portability)");
	const markers = out.indexOf(SECTION_START);
	assert.ok(markers < anchor, "section lands before the anchor heading");
	assert.match(out, /^# pi-fleet-kit/, "title untouched");
});

test("spliceAuditSection: replaces existing marked content in place", () => {
	const withSection = spliceAuditSection(README, SECTION);
	const updated = spliceAuditSection(withSection, "## TypeScript audit\n\n1 error");
	assert.match(updated, /1 error/);
	assert.doesNotMatch(updated, /No findings/);
	assert.equal(updated.split(SECTION_START).length - 1, 1, "exactly one start marker");
	assert.equal(updated.split(SECTION_END).length - 1, 1, "exactly one end marker");
	const anchor = updated.indexOf("## Machine requirements (portability)");
	assert.ok(updated.indexOf(SECTION_START) < anchor, "still before anchor");
});

test("spliceAuditSection: idempotent", () => {
	const once = spliceAuditSection(README, SECTION);
	const twice = spliceAuditSection(once, SECTION);
	assert.equal(once, twice);
});

test("spliceAuditSection: falls back to end of file when anchor is gone", () => {
	const noAnchor = "# pi-fleet-kit\n\nintro only\n";
	const out = spliceAuditSection(noAnchor, SECTION);
	assert.match(out, new RegExp(`${SECTION_START}[\\s\\S]*${SECTION_END}\\n$`));
	assert.match(out, /^# pi-fleet-kit/);
});
