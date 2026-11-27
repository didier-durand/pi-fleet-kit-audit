import assert from "node:assert/strict";
import test from "node:test";

import { archiveStamp } from "../lib/archive-stamp.mjs";

test("archiveStamp: date + hours + minutes + seconds, filename-safe", () => {
	assert.equal(archiveStamp("2026-11-27T09:41:52.123Z"), "2026-11-27T09-41-52");
});

test("archiveStamp: two runs in the same minute get distinct stamps", () => {
	const a = archiveStamp("2026-11-27T09:41:01.000Z");
	const b = archiveStamp("2026-11-27T09:41:59.000Z");
	assert.notEqual(a, b);
});

test("archiveStamp: stable across UTC offsets (input is already ISO UTC)", () => {
	assert.equal(archiveStamp("2026-11-27T23:59:59.999Z"), "2026-11-27T23-59-59");
});
