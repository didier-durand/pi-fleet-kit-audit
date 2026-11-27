# Audit report — pi-fleet-kit @ 4b5e92d

Generated: 2026-11-27 18:09 UTC by [pi-fleet-kit-audit](https://github.com/didier-durand/pi-fleet-kit-audit)

| Check | Tool | Status | Summary |
|---|---|---|---|
| Secrets | gitleaks | ⚠️ WARN | 5 finding(s), all in test fixtures (likely fake data) — details in artifacts only |
| SAST | semgrep | ✅ PASS | no semgrep findings |
| SAST (rules) | eslint-plugin-security | ❌ FAIL | 62 finding(s) in source code (+232 in tests) — see eslint-summary.md |
| Dependencies | npm audit | ⚠️ WARN | 4 of 4 package dir(s) lack a committed lockfile — see npm-audit.md |
| Hygiene | script | ❌ FAIL | see hygiene.md below |

## Hygiene details

- **committed env files:** ./.env — verify they hold no real secrets and add .env to .gitignore
- `.gitignore` missing pattern: `.env`
- TODO/FIXME/HACK markers in code: 0
- files >1MB: ./extensions/pi-obs/tests/fixtures/data/traces.json.gz ./warp/AI-agent-fleet-Icon-rounded.png ./warp/AI-agent-fleet-Icon.png 

## ESLint security findings

| Rule | src | tests |
|---|---|---|
| security/detect-non-literal-fs-filename | 41 | 199 |
| security/detect-non-literal-regexp | 0 | 5 |
| security/detect-object-injection | 14 | 27 |
| security/detect-possible-timing-attacks | 4 | 0 |
| security/detect-unsafe-regex | 3 | 1 |

<details><summary>Source findings (non-test code)</summary>

- extensions/git-status/git-status.ts (line 144): security/detect-unsafe-regex — Unsafe Regular Expression
- extensions/git-status/git-status.ts (line 198): security/detect-unsafe-regex — Unsafe Regular Expression
- extensions/pi-obs/src/cli.ts (line 123): security/detect-possible-timing-attacks — Potential timing attack, left side: true
- extensions/pi-obs/src/cli.ts (line 127): security/detect-possible-timing-attacks — Potential timing attack, left side: true
- extensions/pi-obs/src/cli.ts (line 131): security/detect-possible-timing-attacks — Potential timing attack, left side: true
- extensions/pi-obs/src/cli.ts (line 138): security/detect-object-injection — Variable Assigned to Object Injection Sink
- extensions/pi-obs/src/cli.ts (line 141): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/config.ts (line 34): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/config.ts (line 210): security/detect-object-injection — Variable Assigned to Object Injection Sink
- extensions/pi-obs/src/config.ts (line 212): security/detect-object-injection — Variable Assigned to Object Injection Sink
- extensions/pi-obs/src/exporters/file.ts (line 142): security/detect-non-literal-fs-filename — Found mkdirSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 146): security/detect-non-literal-fs-filename — Found existsSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 146): security/detect-non-literal-fs-filename — Found statSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 147): security/detect-non-literal-fs-filename — Found appendFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 158): security/detect-non-literal-fs-filename — Found existsSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 158): security/detect-non-literal-fs-filename — Found unlinkSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 161): security/detect-non-literal-fs-filename — Found existsSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/exporters/file.ts (line 161): security/detect-non-literal-fs-filename — Found renameSync from package "node:fs" with non literal argument at index 0,1
- extensions/pi-obs/src/exporters/file.ts (line 163): security/detect-non-literal-fs-filename — Found renameSync from package "node:fs" with non literal argument at index 0,1
- extensions/pi-obs/src/exporters/otlp-json.ts (line 49): security/detect-unsafe-regex — Unsafe Regular Expression
- extensions/pi-obs/src/exporters/otlp.ts (line 100): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/index.ts (line 163): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/index.ts (line 242): security/detect-non-literal-fs-filename — Found readdirSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/index.ts (line 257): security/detect-non-literal-fs-filename — Found statSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/index.ts (line 368): security/detect-possible-timing-attacks — Potential timing attack, left side: true
- extensions/pi-obs/src/index.ts (line 595): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/index.ts (line 703): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/model.ts (line 147): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/model.ts (line 318): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/replay.ts (line 124): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/replay.ts (line 155): security/detect-non-literal-fs-filename — Found readdirSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/replay.ts (line 163): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/src/replay.ts (line 193): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/replay.ts (line 194): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/replay.ts (line 223): security/detect-object-injection — Generic Object Injection Sink
- extensions/pi-obs/src/version.ts (line 24): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/utils/traces-to-html.ts (line 74): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/utils/traces-to-html.ts (line 177): security/detect-non-literal-fs-filename — Found writeFileSync from package "node:fs" with non literal argument at index 0
- extensions/pi-obs/utils/traces-to-html.ts (line 268): security/detect-non-literal-fs-filename — Found writeFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 63): security/detect-non-literal-fs-filename — Found mkdirSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 64): security/detect-non-literal-fs-filename — Found renameSync from package "node:fs" with non literal argument at index 0,1
- extensions/prompt-trigger/prompt-trigger.ts (line 91): security/detect-non-literal-fs-filename — Found writeFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 92): security/detect-non-literal-fs-filename — Found renameSync from package "node:fs" with non literal argument at index 0,1
- extensions/prompt-trigger/prompt-trigger.ts (line 103): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 115): security/detect-non-literal-fs-filename — Found appendFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 125): security/detect-non-literal-fs-filename — Found mkdirSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 135): security/detect-non-literal-fs-filename — Found readdirSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 141): security/detect-non-literal-fs-filename — Found unlinkSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 141): security/detect-object-injection — Function Call Object Injection Sink
- extensions/prompt-trigger/prompt-trigger.ts (line 150): security/detect-non-literal-fs-filename — Found readdirSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 180): security/detect-object-injection — Generic Object Injection Sink
- extensions/prompt-trigger/prompt-trigger.ts (line 203): security/detect-non-literal-fs-filename — Found existsSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 206): security/detect-non-literal-fs-filename — Found writeFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 207): security/detect-non-literal-fs-filename — Found renameSync from package "node:fs" with non literal argument at index 0,1
- extensions/prompt-trigger/prompt-trigger.ts (line 210): security/detect-non-literal-fs-filename — Found unlinkSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 251): security/detect-non-literal-fs-filename — Found writeFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 309): security/detect-non-literal-fs-filename — Found readdirSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 337): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 352): security/detect-non-literal-fs-filename — Found readFileSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 393): security/detect-non-literal-fs-filename — Found unlinkSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 409): security/detect-non-literal-fs-filename — Found readdirSync from package "node:fs" with non literal argument at index 0
- extensions/prompt-trigger/prompt-trigger.ts (line 423): security/detect-non-literal-fs-filename — Found statSync from package "node:fs" with non literal argument at index 0
</details>

## Dependency audit

- [.](<.>) — WARNING: no package-lock.json committed; dependency versions unpinned, audit impossible (generate lockfile and commit it)
- [./extensions/git-status](<./extensions/git-status>) — WARNING: no package-lock.json committed; dependency versions unpinned, audit impossible (generate lockfile and commit it)
- [./extensions/pi-obs](<./extensions/pi-obs>) — WARNING: no package-lock.json committed; dependency versions unpinned, audit impossible (generate lockfile and commit it)
- [./extensions/prompt-trigger](<./extensions/prompt-trigger>) — WARNING: no package-lock.json committed; dependency versions unpinned, audit impossible (generate lockfile and commit it)
