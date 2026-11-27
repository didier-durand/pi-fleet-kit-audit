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

## CI

`.github/workflows/audit.yml` runs weekly (Monday 06:00 UTC), on every push, and on demand (`workflow_dispatch`).
Artifacts (full JSON output) are uploaded for 90 days; the human-readable `reports/report.md` is committed back on push runs.

> ⚠️ The report is published in a public repo. Findings (rule IDs, file paths) are fine;
> any actual secret values are redacted by gitleaks and must never be committed manually.
