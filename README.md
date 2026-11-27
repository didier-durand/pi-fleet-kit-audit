# pi-fleet-kit-audit

Automated quality & security audit of [didier-durand/pi-fleet-kit](https://github.com/didier-durand/pi-fleet-kit).

## What it checks

| Check | Tool | What it catches |
|---|---|---|
| Secrets | [gitleaks](https://github.com/gitleaks/gitleaks) | API keys, tokens, passwords committed to the repo |
| SAST | [Semgrep](https://semgrep.dev) (`p/javascript`, `p/typescript`, `p/secrets`) | Injection, unsafe patterns, hardcoded secrets in code |
| SAST (rules) | [eslint-plugin-security](https://github.com/nodesecurity/eslint-plugin-security) | `eval`, unsafe regex, non-literal `fs` paths, child-process misuse in `.ts`/`.js` |
| Dependencies | `npm audit` (per package dir) | Known CVEs in dependencies |
| Hygiene | `scripts/audit.sh` | Committed `.env` files, missing `.gitignore` patterns, TODO/FIXME debt, oversized files |

## Running

```bash
./scripts/audit.sh [TARGET_REPO_URL] [OUTPUT_DIR]
# defaults to https://github.com/didier-durand/pi-fleet-kit.git → ./reports/
```

Tools that aren't installed locally are skipped gracefully; CI installs everything.

## Reports

Both pipelines commit their sanitized Markdown reports to this repo; raw scan outputs are
**CI artifacts only** (90-day retention), since they may contain secret **snippets**.

- `audits/daily-audits/ts-audit-<date>T<h-mm-ss>.md` — one archive per daily-audit run;
  each run prunes archives older than **2 weeks** (retention is encoded in the filenames)
- `audits/weekly-audits/weekly-audit-<date>T<h-mm-ss>.md` — one archive per weekly-audit run;
  each run prunes archives older than **3 months** (retention is encoded in the filenames)

Each run's artifact bundle additionally contains:

- `report.md` — latest sanitized report (stable name inside the artifact)
- `<YYYY-MM-DD>-audit-report.md` — dated copy for that run
- raw scan outputs (`gitleaks.json`, `semgrep.json`, …), which may contain secret **snippets** and
  must never be committed

## CI

`.github/workflows/weekly-audit.yml` runs weekly (Monday 06:00 UTC), on every push, and on demand (`workflow_dispatch`).
Full JSON output is uploaded as a 90-day artifact; the sanitized Markdown report is committed to
`audits/weekly-audits/` (same naming convention as the daily archives). The job stays green and
reports every per-check status in its run summary.

Daily TypeScript audits run separately via `daily-audit.yml` — their reports **are** committed
(`audits/daily-audits/`) because they contain rule IDs and counts only, never source snippets.

> ⚠️ The report is published in a public repo. Findings (rule IDs, file paths) are fine;
> any actual secret values are redacted by gitleaks and must never be committed manually.

## TypeScript audit (daily-audit)

`.github/workflows/daily-audit.yml` runs **daily at 05:00 CET** (06:00 during DST — GitHub cron is
UTC-only) and on demand. Unlike `weekly-audit.yml` (weekly, secrets/SAST/deps/hygiene), `daily-audit` is a
deep, type-aware **TypeScript quality audit** (security + efficiency) of pi-fleet-kit's extensions:
typescript-eslint strict type-checked, `eslint-plugin-security`, `eslint-plugin-regexp` (ReDoS),
`eslint-plugin-sonarjs`. The job clones the pi-fleet-kit tree fresh on every run (`AUDIT_ROOT`),
so it never depends on a developer machine.

- Tooling (with its own tests): [`utils/ts-audit/`](utils/ts-audit/) — reports are produced by a
  first-party ESLint formatter named `json-to-md` (no npm package by that name exists; verified).
- `audits/daily-audits/ts-audit-<date>T<h-mm-ss>.md` — one Markdown archive per run (seconds included —
  two runs can never collide). Note this is separate from the `reports/` scheme above.
- A live summary is spliced between markers in this README; committed by `github-actions[bot]`
  only when content changes. Lint findings never fail the job — the tables carry the status.

<!-- ts-audit:start -->
## TypeScript audit

📅 **Status as of 2026-11-27 18:43 UTC** · commit `0ec06d371d1c450d9798c1c39b53ef8f6d05eef6` · 📄 [full report](audits/daily-audits/ts-audit-2026-11-27T18-43-38.md)

### Summary

| Scope | Errors | Warnings | Files scanned | Files with findings | Rules triggered |
|---|---|---|---|---|---|
| Functional code | 118 | 62 | 18 | 14 | 30 |
| Tests | 607 | 232 | 24 | 23 | 39 |

### Totals per rule

| Rule | Functional code | Tests |
|---|---|---|
| `security/detect-non-literal-fs-filename` | 41 | 199 |
| `@typescript-eslint/no-confusing-void-expression` | 40 | 16 |
| `security/detect-object-injection` | 14 | 27 |
| `@typescript-eslint/require-await` | 11 | 4 |
| `sonarjs/cognitive-complexity` | 10 | 0 |
| `@typescript-eslint/no-unnecessary-condition` | 6 | 26 |
| `@typescript-eslint/no-unused-vars` | 6 | 17 |
| `sonarjs/no-dead-store` | 5 | 5 |
| `regexp/no-unused-capturing-group` | 5 | 0 |
| `sonarjs/super-linear-regex` | 4 | 3 |
| `@typescript-eslint/no-base-to-string` | 4 | 2 |
| `regexp/prefer-w` | 4 | 0 |
| `security/detect-possible-timing-attacks` | 4 | 0 |
| `sonarjs/no-alphabetical-sort` | 3 | 19 |
| `sonarjs/no-unused-vars` | 3 | 5 |
| `security/detect-unsafe-regex` | 3 | 1 |
| `@typescript-eslint/no-unnecessary-type-conversion` | 2 | 2 |
| `sonarjs/different-types-comparison` | 2 | 2 |
| `sonarjs/use-type-alias` | 2 | 0 |
| `@typescript-eslint/no-unnecessary-type-assertion` | 1 | 92 |
| `sonarjs/unused-import` | 1 | 7 |
| `regexp/no-dupe-characters-character-class` | 1 | 0 |
| `regexp/use-ignore-case` | 1 | 0 |
| `sonarjs/duplicates-in-character-class` | 1 | 0 |
| `sonarjs/function-return-type` | 1 | 0 |
| `sonarjs/max-switch-cases` | 1 | 0 |
| `sonarjs/no-all-duplicated-branches` | 1 | 0 |
| `sonarjs/no-nested-conditional` | 1 | 0 |
| `sonarjs/no-redundant-jump` | 1 | 0 |
| `sonarjs/regex-complexity` | 1 | 0 |
| `@typescript-eslint/no-floating-promises` | 0 | 275 |
| `@typescript-eslint/restrict-template-expressions` | 0 | 41 |
| `sonarjs/no-clear-text-protocols` | 0 | 23 |
| `sonarjs/no-incomplete-assertions` | 0 | 13 |
| `@typescript-eslint/no-non-null-assertion` | 0 | 12 |
| `@typescript-eslint/await-thenable` | 0 | 10 |
| `@typescript-eslint/no-dynamic-delete` | 0 | 6 |
| `sonarjs/publicly-writable-directories` | 0 | 6 |
| `security/detect-non-literal-regexp` | 0 | 5 |
| `sonarjs/constructor-for-side-effects` | 0 | 5 |
| `sonarjs/assertions-in-tests` | 0 | 3 |
| `sonarjs/no-trivial-assertions` | 0 | 2 |
| `@typescript-eslint/no-meaningless-void-operator` | 0 | 1 |
| `@typescript-eslint/only-throw-error` | 0 | 1 |
| `regexp/no-super-linear-backtracking` | 0 | 1 |
| `regexp/optimal-quantifier-concatenation` | 0 | 1 |
| `sonarjs/no-duplicate-test-title` | 0 | 1 |
| `sonarjs/no-nested-functions` | 0 | 1 |
| `sonarjs/no-nested-template-literals` | 0 | 1 |
| `sonarjs/no-os-command-from-path` | 0 | 1 |
| `sonarjs/no-unused-collection` | 0 | 1 |
| `sonarjs/pseudo-random` | 0 | 1 |
| `sonarjs/void-use` | 0 | 1 |
<!-- ts-audit:end -->
