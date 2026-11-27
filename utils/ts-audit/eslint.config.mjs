/**
 * ESLint flat config for the fleet's TypeScript security & efficiency audit.
 *
 * Rule sources, by audit goal:
 * - security:        eslint-plugin-security (object injection, unsafe regex
 *                    construction, child-process shells, ...)
 * - regex DoS:       eslint-plugin-regexp (catastrophic backtracking, ...)
 * - soundness /
 *   efficiency:      typescript-eslint strictTypeChecked (floating promises,
 *                    unnecessary conditions, misused promises, ...) plus
 *                    eslint-plugin-sonarjs (complexity, duplicated branches,
 *                    ignored return values, ...)
 *
 * Style rules are deliberately absent: this audit measures security and
 * efficiency, not formatting.
 */
import regexp from "eslint-plugin-regexp";
import security from "eslint-plugin-security";
import sonarjs from "eslint-plugin-sonarjs";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		files: ["extensions/**/*.ts"],
		// The audit targets shipped extension code; unit tests are excluded to
		// keep the daily report focused (test-only idioms like unawaited asserts
		// would otherwise dominate the findings).
		ignores: ["**/tests/**", "**/*.test.ts"],
		extends: [
			tseslint.configs.strictTypeChecked,
			security.configs.recommended,
			regexp.configs.recommended,
			sonarjs.configs.recommended,
		],
		languageOptions: {
			parserOptions: {
				// Type-aware linting needs a tsconfig covering every audited file.
				// audit.mjs generates one per run (the target tree may live in a
				// different checkout); the committed default covers self-audits.
				project: process.env.AUDIT_TSCONFIG ?? "./tsconfig.audit.json",
				tsconfigRootDir: import.meta.dirname,
			},
		},
		rules: {
			// The pi-coding-agent type shim (shims.d.ts) makes the harness API
			// `any`; the unsafe-* family would flag every extension entry point
			// as untypeable — that is shim noise, not a code defect. Local type
			// unsafety is still caught by the strict compiler config itself.
			"@typescript-eslint/no-unsafe-argument": "off",
			"@typescript-eslint/no-unsafe-assignment": "off",
			"@typescript-eslint/no-unsafe-call": "off",
			"@typescript-eslint/no-unsafe-member-access": "off",
			"@typescript-eslint/no-unsafe-return": "off",
			// Interpolating numbers/booleans is idiomatic in status output and
			// not a security or efficiency concern; nullish/undefined still
			// flags (the real hazard: rendering "undefined" into UI strings).
			"@typescript-eslint/restrict-template-expressions": [
				"error",
				{ allowNumber: true, allowBoolean: true },
			],
		},
	},
);
