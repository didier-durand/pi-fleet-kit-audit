# Last 5 audit reports — pi-fleet-kit

Latest run: 2026-11-27 09:28 UTC @ `19ed98f` — [latest report](2026-11-27-audit-report.md)

| Date | Commit | Secrets | SAST | ESLint | Deps | Hygiene | Report |
|---|---|---|---|---|---|---|---|
| 2026-11-27 | `19ed98f` | WARN | PASS | FAIL | WARN | FAIL | [2026-11-27](2026-11-27-audit-report.md) |

## Current status

- **Secrets**: WARN — 5 finding(s), all in test fixtures (likely fake data) — details in artifacts only
- **SAST**: PASS — no semgrep findings
- **SAST (rules)**: FAIL — 62 finding(s) in source code (+232 in tests) — see eslint-summary.md
- **Dependencies**: WARN — 4 of 4 package dir(s) lack a committed lockfile — see npm-audit.md
- **Hygiene**: FAIL — see hygiene.md below

## Evolution

- only one daily report available so far
