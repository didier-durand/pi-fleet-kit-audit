#!/usr/bin/env bash
# audit.sh — quality & security audit of a target git repository.
#
# Usage: ./scripts/audit.sh [TARGET_REPO_URL] [OUTPUT_DIR]
#
# Each check degrades gracefully: if a tool is not installed, the check is
# marked SKIPPED and does not fail the audit (CI installs all tools).
#
# Checks:
#   1. gitleaks                 — committed secrets
#   2. semgrep                  — SAST (JS/TS + secrets rulesets)
#   3. eslint + security plugin — SAST for .ts/.js (security rules)
#   4. npm audit                — dependency vulnerabilities (per package dir)
#   5. hygiene                  — committed .env files, .gitignore, TODOs, big files
#
# Exit code: 0 if no check FAILED (skipped tools don't fail the run), 1 otherwise.

set -uo pipefail

TARGET_URL="${1:-https://github.com/didier-durand/pi-fleet-kit.git}"
TARGET_BRANCH="${TARGET_BRANCH:-main}"
OUT_DIR="${2:-reports}"
WORK_DIR="$(mktemp -d)"
trap 'rm -rf "$WORK_DIR"' EXIT

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DATE="$(date -u '+%Y-%m-%d %H:%M UTC')"
TARGET_NAME="$(basename "$TARGET_URL" .git)"

# OUT_DIR may be relative — resolve it now, before we cd into the clone
mkdir -p "$OUT_DIR"
OUT_DIR="$(cd "$OUT_DIR" && pwd)"

log()  { printf '\033[1;34m[audit]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[warn ]\033[0m %s\n' "$*"; }

# ---------------------------------------------------------------------------
# Clone target
# ---------------------------------------------------------------------------
log "Cloning $TARGET_URL (branch: $TARGET_BRANCH) ..."
git clone --depth 1 --branch "$TARGET_BRANCH" "$TARGET_URL" "$WORK_DIR/target" >/dev/null 2>&1 || {
  echo "FATAL: cannot clone $TARGET_URL" >&2
  exit 1
}
cd "$WORK_DIR/target"
COMMIT="$(git rev-parse --short HEAD)"
log "Audited commit: $COMMIT"

# ---------------------------------------------------------------------------
# 1. Secrets (gitleaks)
# ---------------------------------------------------------------------------
GL_STATUS=SKIPPED; GL_SUMMARY="gitleaks not installed"
if command -v gitleaks >/dev/null 2>&1; then
  log "Running gitleaks ..."
  gitleaks detect --source . --no-git --report-format json --report-path "$OUT_DIR/gitleaks.json" >/dev/null 2>&1
  GL_RC=$?
  N=$(node -e "try{const r=require('$OUT_DIR/gitleaks.json');console.log(Array.isArray(r)?r.length:0)}catch(e){console.log('?')}" 2>/dev/null)
  if [ "$GL_RC" = "0" ]; then
    GL_STATUS=PASS; GL_SUMMARY="no secrets detected"
  else
    # Findings under test dirs are almost always fake fixture data — downgrade
    REAL=$(node -e "
      try {
        const r = require('$OUT_DIR/gitleaks.json');
        console.log(r.filter(f => !/\/(tests?|fixtures|__mocks__)\//.test(f.File)).length);
      } catch (e) { console.log('?'); }
    " 2>/dev/null)
    if [ "$REAL" = "0" ]; then
      GL_STATUS=WARN; GL_SUMMARY="$N finding(s), all in test fixtures (likely fake data) — details in artifacts only"
    else
      GL_STATUS=FAIL; GL_SUMMARY="$N finding(s), $REAL outside test dirs — REVIEW; keep gitleaks.json out of public reports"
    fi
  fi
else
  warn "gitleaks not installed — skipping secrets scan"
fi

# ---------------------------------------------------------------------------
# 2. SAST (semgrep)
# ---------------------------------------------------------------------------
SG_STATUS=SKIPPED; SG_SUMMARY="semgrep not installed"
if command -v semgrep >/dev/null 2>&1; then
  log "Running semgrep (p/javascript p/typescript p/secrets) ..."
  semgrep scan --config p/javascript --config p/typescript --config p/secrets \
    --json --quiet --metrics=off > "$OUT_DIR/semgrep.json" 2>/dev/null
  N=$(node -e "try{const r=require('$OUT_DIR/semgrep.json');console.log(r.results.length)}catch(e){console.log('?')}" 2>/dev/null)
  if [ "$N" = "0" ]; then SG_STATUS=PASS; SG_SUMMARY="no semgrep findings"
  elif [ "$N" = "?" ]; then SG_STATUS=WARN; SG_SUMMARY="semgrep output unreadable"
  else SG_STATUS=FAIL; SG_SUMMARY="$N finding(s) — details in artifacts only"
  fi
else
  warn "semgrep not installed — skipping SAST scan"
fi

# ---------------------------------------------------------------------------
# 3. ESLint security scan (.ts/.js)
# ---------------------------------------------------------------------------
ES_STATUS=SKIPPED; ES_SUMMARY="node/npm not installed"
if command -v npm >/dev/null 2>&1; then
  log "Running eslint-plugin-security over .ts/.js ..."
  # Install into the disposable target clone so linted files sit inside the
  # eslint base path; restore package files and remove the config afterwards.
  cp package.json "$WORK_DIR/pkg.bak" 2>/dev/null
  cat > "$WORK_DIR/target/eslint.config.mjs" <<'EOF'
import security from "eslint-plugin-security";
import tseslint from "typescript-eslint";
export default [
  {
    files: ["**/*.ts", "**/*.js"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parser: tseslint.parser,
    },
    plugins: { security },
    rules: { ...security.configs.recommended.rules },
  },
];
EOF
  npm install --no-audit --no-fund --silent --no-save \
    eslint typescript-eslint eslint-plugin-security >/dev/null 2>&1
  npx eslint . --format json > "$OUT_DIR/eslint-security.json" 2>"$OUT_DIR/eslint-stderr.log"
  cp "$WORK_DIR/pkg.bak" package.json 2>/dev/null
  rm -f eslint.config.mjs
  N=$(node -e "
    try {
      const r = require('$OUT_DIR/eslint-security.json');
      if (!Array.isArray(r)) throw new Error('not json');
      const rel = p => (p||'').replace(/^.*target\\//,'');
      const isTest = p => /(^|\\/)(tests?|fixtures|__mocks__)\\//.test(p) || /\\.test\\.[jt]s$/.test(p);
      const msgs = r.flatMap(f => f.messages.map(m => ({...m, file: rel(f.filePath), test: isTest(f.filePath)})));
      const byRule = arr => { const g = {}; arr.forEach(m => { (g[m.ruleId] = g[m.ruleId] || []).push(m); }); return g; };
      const src = msgs.filter(m => !m.test), test = msgs.filter(m => m.test);
      const gs = byRule(src), gt = byRule(test);
      const rules = [...new Set([...Object.keys(gs), ...Object.keys(gt)])].sort();
      let out = '| Rule | src | tests |\\n|---|---|---|\\n';
      rules.forEach(rule => { out += '| ' + rule + ' | ' + (gs[rule]?gs[rule].length:0) + ' | ' + (gt[rule]?gt[rule].length:0) + ' |\\n'; });
      if (src.length) {
        out += '\\n<details><summary>Source findings (non-test code)</summary>\\n\\n';
        out += src.map(m => '- ' + m.file + ' (line ' + m.line + '): ' + m.ruleId + ' — ' + m.message).join('\\n');
        out += '\\n</details>\\n';
      }
      require('fs').writeFileSync('$OUT_DIR/eslint-summary.md', out);
      console.log(src.length + ' ' + test.length);
    } catch (e) { console.log('? ?'); }
  " 2>/dev/null)
  SRC_N=${N%% *}; TEST_N=${N##* }
  if [ "$SRC_N" = "0" ] && [ "$TEST_N" != "?" ]; then ES_STATUS=PASS; ES_SUMMARY="no security-rule findings in source code ($TEST_N in tests)"
  elif [ "$SRC_N" = "?" ] || [ "$TEST_N" = "?" ]; then ES_STATUS=WARN; ES_SUMMARY="eslint run failed — see eslint-stderr.log (artifact only)"
  elif [ "$SRC_N" = "0" ]; then ES_STATUS=WARN; ES_SUMMARY="$TEST_N finding(s), all in tests — see eslint-summary.md"
  else ES_STATUS=FAIL; ES_SUMMARY="$SRC_N finding(s) in source code (+$TEST_N in tests) — see eslint-summary.md"
  fi
else
  warn "npm not installed — skipping eslint security scan"
fi

# ---------------------------------------------------------------------------
# 4. Dependency audit (npm audit, per package dir)
# ---------------------------------------------------------------------------
NA_STATUS=SKIPPED; NA_SUMMARY="npm not installed"
if command -v npm >/dev/null 2>&1; then
  log "Running npm audit across package dirs ..."
  : > "$OUT_DIR/npm-audit.md"
  FOUND=0; DIRS=0; NOLOCK=0
  while IFS= read -r pkg; do
    D="$(dirname "$pkg")"
    DIRS=$((DIRS+1))
    TAG="$(echo "$D" | sed 's|[/\.]|_|g')"
    if [ ! -f "$D/package-lock.json" ]; then
      NOLOCK=$((NOLOCK+1))
      echo "- [$D](<$D>) — WARNING: no package-lock.json committed; dependency versions unpinned, audit impossible (generate lockfile and commit it)" >> "$OUT_DIR/npm-audit.md"
      continue
    fi
    if (cd "$D" && npm audit --json > "$OUT_DIR/audit-$TAG.json" 2>/dev/null); then
      echo "- [$D](<$D>) — PASS (no known vulnerabilities)" >> "$OUT_DIR/npm-audit.md"
    else
      V=$(node -e "try{const r=require('$OUT_DIR/audit-$TAG.json');console.log(Object.values(r.metadata.vulnerabilities||{}).reduce((a,b)=>a+b,0))}catch(e){console.log('?')}" 2>/dev/null)
      FOUND=1
      echo "- [$D](<$D>) — **$V vulnerability/vulnerabilities** (details in artifacts only)" >> "$OUT_DIR/npm-audit.md"
    fi
  done < <(find . -name package.json -not -path "*/node_modules/*")
  if [ "$FOUND" != "0" ]; then NA_STATUS=FAIL; NA_SUMMARY="vulnerabilities found — see npm-audit.md"
  elif [ "$NOLOCK" != "0" ]; then NA_STATUS=WARN; NA_SUMMARY="$NOLOCK of $DIRS package dir(s) lack a committed lockfile — see npm-audit.md"
  else NA_STATUS=PASS; NA_SUMMARY="clean across $DIRS package dir(s)"
  fi
else
  warn "npm not installed — skipping dependency audit"
fi

# ---------------------------------------------------------------------------
# 5. Repo hygiene
# ---------------------------------------------------------------------------
log "Running hygiene checks ..."
: > "$OUT_DIR/hygiene.md"

ENV_FILES=$(find . -name ".env*" -not -path "./.git/*" -not -path "*/node_modules/*")
HY_ENV=PASS
if [ -n "$ENV_FILES" ]; then
  echo "- **committed env files:** $ENV_FILES — verify they hold no real secrets and add .env to .gitignore" >> "$OUT_DIR/hygiene.md"
  HY_ENV=FAIL
else
  echo "- no committed .env files" >> "$OUT_DIR/hygiene.md"
fi

# .gitignore sanity: does it cover .env, node_modules?
HY_GIT=PASS
for pat in ".env" "node_modules"; do
  grep -q -- "$pat" .gitignore 2>/dev/null || { echo "- \`.gitignore\` missing pattern: \`$pat\`" >> "$OUT_DIR/hygiene.md"; HY_GIT=FAIL; }
done
[ "$HY_GIT" = "PASS" ] && echo "- \`.gitignore\` covers .env / node_modules" >> "$OUT_DIR/hygiene.md"

TODO=$(grep -rn "TODO\|FIXME\|HACK" --include="*.ts" --include="*.js" --exclude-dir=node_modules . 2>/dev/null | wc -l)
echo "- TODO/FIXME/HACK markers in code: $TODO" >> "$OUT_DIR/hygiene.md"

LARGE=$(find . -type f -size +1M -not -path "./.git/*" -not -path "*/node_modules/*" | head -5)
if [ -n "$LARGE" ]; then
  echo "- files >1MB: $(echo "$LARGE" | tr '\n' ' ')" >> "$OUT_DIR/hygiene.md"
else
  echo "- no files >1MB (excluding .git/node_modules)" >> "$OUT_DIR/hygiene.md"
fi

if [ "$HY_ENV" = "FAIL" ] || [ "$HY_GIT" = "FAIL" ]; then HY_STATUS=FAIL; else HY_STATUS=PASS; fi
HY_SUMMARY="see hygiene.md below"

# ---------------------------------------------------------------------------
# Report
# ---------------------------------------------------------------------------
REPORT="$OUT_DIR/report.md"
status_icon() { case "$1" in PASS) echo "✅";; FAIL) echo "❌";; WARN) echo "⚠️";; *) echo "⏭️";; esac; }

cat > "$REPORT" <<EOF
# Audit report — $TARGET_NAME @ $COMMIT

Generated: $DATE by [pi-fleet-kit-audit](https://github.com/didier-durand/pi-fleet-kit-audit)

| Check | Tool | Status | Summary |
|---|---|---|---|
| Secrets | gitleaks | $(status_icon "$GL_STATUS") $GL_STATUS | $GL_SUMMARY |
| SAST | semgrep | $(status_icon "$SG_STATUS") $SG_STATUS | $SG_SUMMARY |
| SAST (rules) | eslint-plugin-security | $(status_icon "$ES_STATUS") $ES_STATUS | $ES_SUMMARY |
| Dependencies | npm audit | $(status_icon "$NA_STATUS") $NA_STATUS | $NA_SUMMARY |
| Hygiene | script | $(status_icon "$HY_STATUS") $HY_STATUS | $HY_SUMMARY |

## Hygiene details

$(cat "$OUT_DIR/hygiene.md")

$( [ -f "$OUT_DIR/eslint-summary.md" ] && echo "## ESLint security findings

$(cat "$OUT_DIR/eslint-summary.md")" )

$( [ -f "$OUT_DIR/npm-audit.md" ] && echo "## Dependency audit

$(cat "$OUT_DIR/npm-audit.md")" )
EOF

log "Report written to $REPORT"

# Dated daily report + rolling last-5 summary
DATED_REPORT="$OUT_DIR/$(date -u +%Y-%m-%d)-audit-report.md"
cp "$REPORT" "$DATED_REPORT"
log "Dated report written to $DATED_REPORT"
node "$SCRIPT_DIR/summarize-reports.cjs" "$OUT_DIR"

log "Done. Statuses: secrets=$GL_STATUS sast=$SG_STATUS eslint=$ES_STATUS deps=$NA_STATUS hygiene=$HY_STATUS"

# Fail CI if any hard check failed (skipped/warned tools don't fail the run)
[ "$GL_STATUS" = "FAIL" ] || [ "$SG_STATUS" = "FAIL" ] || [ "$ES_STATUS" = "FAIL" ] || [ "$NA_STATUS" = "FAIL" ] || [ "$HY_STATUS" = "FAIL" ] && exit 1
exit 0
