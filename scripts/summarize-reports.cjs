// summarize-reports.cjs — scans <reports-dir> for YYYY-MM-DD-audit-report.md files,
// then writes last-5-reports.md linking the last 5 daily reports, summarizing the
// current status and its evolution across those runs.
//
// Usage: node summarize-reports.cjs <reports-dir>

const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || '.';
const CHECKS = ['Secrets', 'SAST', 'SAST (rules)', 'Dependencies', 'Hygiene'];

function parseReport(file) {
  const text = fs.readFileSync(file, 'utf8');
  const head = text.match(/^# Audit report — (.+?) @ (\S+)/m) || [];
  const generated = (text.match(/^Generated: (.*?) by /m) || [])[1] || '';
  const rows = {};
  for (const line of text.split('\n')) {
    const m = line.match(/^\|\s*([^|]+?)\s*\|[^|]*\|([^|]*)\|([^|]*)\|/);
    if (!m) continue;
    const label = m[1].replace(/\s+/g, ' ');
    if (!CHECKS.includes(label)) continue; // skips header/separator rows
    const status = (m[2].match(/PASS|WARN|FAIL|SKIPPED/) || ['SKIPPED'])[0];
    rows[label] = { status, summary: m[3].trim() };
  }
  return {
    date: path.basename(file).slice(0, 10),
    repo: head[1] || 'unknown',
    commit: head[2] || 'unknown',
    generated,
    rows,
  };
}

const files = fs.readdirSync(dir)
  .map(f => f.match(/^(\d{4}-\d{2}-\d{2})-audit-report\.md$/))
  .filter(Boolean)
  .map(m => m[0])
  .sort();

if (!files.length) {
  console.error('no dated audit reports found in ' + dir);
  process.exit(0);
}

const last5 = files.slice(-5).reverse(); // newest first
const parsed = last5.map(f => parseReport(path.join(dir, f)));
const latest = parsed[0];

let out = `# Last 5 audit reports — ${latest.repo}\n\n`;
out += `Latest run: ${latest.generated} @ \`${latest.commit}\` — [latest report](${last5[0]})\n\n`;

// Compact history table, oldest -> newest (left to right)
out += '| Date | Commit | Secrets | SAST | ESLint | Deps | Hygiene | Report |\n';
out += '|---|---|---|---|---|---|---|---|\n';
for (const p of [...parsed].reverse()) {
  const st = k => (p.rows[k] ? p.rows[k].status : '—');
  out += `| ${p.date} | \`${p.commit}\` | ${st('Secrets')} | ${st('SAST')} | ${st('SAST (rules)')} | ${st('Dependencies')} | ${st('Hygiene')} | [${p.date}](${p.date}-audit-report.md) |\n`;
}

out += '\n## Current status\n\n';
for (const c of CHECKS) {
  const r = latest.rows[c];
  if (r) out += `- **${c}**: ${r.status} — ${r.summary}\n`;
}

if (parsed.length >= 2) {
  out += '\n## Evolution vs previous run\n\n';
  let changes = 0;
  for (const c of CHECKS) {
    const cur = latest.rows[c] && latest.rows[c].status;
    const prev = parsed[1].rows[c] && parsed[1].rows[c].status;
    if (cur && prev && cur !== prev) {
      changes++;
      const arrow = cur === 'FAIL' ? '⚠️ regression' : cur === 'PASS' ? '✅ improvement' : 'changed';
      out += `- **${c}**: ${prev} → **${cur}** (${arrow})\n`;
    }
  }
  if (!changes) out += '- no check status changed\n';
  if (parsed.length < 5) out += `\n(${parsed.length} of 5 possible daily reports available so far)\n`;
} else {
  out += '\n## Evolution\n\n- only one daily report available so far\n';
}

fs.writeFileSync(path.join(dir, 'last-5-reports.md'), out);
console.log(`last-5-reports.md written (${parsed.length} report(s) considered: ${last5.join(', ')})`);
