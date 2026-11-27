/**
 * ESLint custom formatter: JSON-shaped lint results → Markdown report.
 *
 * Named `json-to-md` so it slots into the standard ESLint formatter
 * mechanism: `eslint --format json-to-md` (via node_modules/eslint-formatter-*)
 * or programmatic `eslint.loadFormatter("<path>/json-to-md.mjs")`.
 *
 * NOTE (deviation from the original request): no npm package named
 * `eslint-plugin-json-to-md` (or `eslint-formatter-json-to-md`) exists
 * (npm registry 404, verified 2026-11-27) — this module provides the
 * equivalent as a first-party formatter.
 *
 * Meta (generatedAt / commit / eslintVersion) can be injected through the
 * context argument; when absent (plain `eslint --format json-to-md` CLI
 * usage) it falls back to the wall clock / GIT_SHA env / "(unknown)".
 */
import { toMarkdown } from "../lib/report.mjs";

export function format(results, context = {}) {
	return toMarkdown(results, {
		generatedAt: context.generatedAt ?? new Date().toISOString(),
		commit: context.commit ?? process.env.GIT_SHA ?? "(unknown)",
		eslintVersion: context.eslintVersion ?? "(unknown)",
		root: context.cwd ?? process.cwd(),
	});
}

// ESLint path-based formatters must export the function itself (an object
// wrapper is rejected with "Formatter must be a function").
export default format;
