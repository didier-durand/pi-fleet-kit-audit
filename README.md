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

- `reports/<YYYY-MM-DD>-audit-report.md` — dated daily report (regenerated on each run for that day)
- `reports/report.md` — copy of the latest report (stable path)
- `reports/last-5-reports.md` — links the last 5 daily reports, shows the current status and its evolution across those runs

Raw scan JSONs (`gitleaks.json`, `semgrep.json`, …) may contain secret **snippets** and are never committed —
they are kept only as CI artifacts (90-day retention).

## CI

`.github/workflows/audit.yml` runs weekly (Monday 06:00 UTC), on every push, and on demand (`workflow_dispatch`).
Artifacts (full JSON output) are uploaded for 90 days; the sanitized dated reports, `report.md` and `last-5-reports.md`
are committed back on push runs.

> ⚠️ The report is published in a public repo. Findings (rule IDs, file paths) are fine;
> any actual secret values are redacted by gitleaks and must never be committed manually.
