#!/usr/bin/env node
/**
 * Static-text audit: a heuristic grep over every .tsx file under src/ for likely
 * hard-coded, user-facing English that bypassed the i18n dictionary (t()/pickText/pickField).
 *
 * This is a lint-style heuristic, not a parser — it flags candidates for human
 * review and will have false positives (hence the allowlist below). Run with:
 *
 *   node scripts/audit-i18n.js
 *
 * Exits non-zero only when it finds a hit outside the allowlist, so it can be
 * wired into CI once the allowlist has stabilised.
 */

const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, '..', 'src');

/** Literal strings that are legitimately English-only and should never be flagged:
 *  brand/acronym names, official names, URLs/emails, registration numbers, technical
 *  units, and other non-prose tokens. Keep this short and explicit — a broad allowlist
 *  defeats the audit. */
const ALLOWLIST = [
  'SIDHKOFED',
  'GeM',
  'MPCS',
  'LAMPS',
  'PACS',
  'FPO',
  'FPOs',
  'SHG',
  'SHGs',
  'NCD',
  'GIGW',
  'WCAG',
  'IST',
  'PMU',
  'kg',
  'EN',
];

const ALLOWLIST_RE = new RegExp(`^(${ALLOWLIST.map((s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})\\b`);

/** Attribute names whose string-literal value is visible to users or assistive tech. */
const USER_FACING_ATTRS = ['aria-label', 'title', 'placeholder', 'alt'];

const ATTR_RE = new RegExp(`\\b(${USER_FACING_ATTRS.join('|')})="([A-Z][^"]{2,})"`, 'g');

/** A capitalised, multi-word JSX text node — e.g. `>Browse by Category<` — used as a
 *  loose heuristic for literal prose left directly in markup instead of `t()`. Only
 *  catches text that opens and closes on the same source line (this repo's actual
 *  style for short labels/headings); text wrapped across multiple lines needs a
 *  human read-through, which is why this audit is a heuristic, not a hard gate. */
const JSX_TEXT_RE = />([A-Z][a-zA-Z]+(?: [a-zA-Z.,'’-]+){2,})</g;

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full, out);
    } else if (entry.name.endsWith('.tsx') && !entry.name.endsWith('.test.tsx')) {
      out.push(full);
    }
  }
  return out;
}

function isAllowlisted(text) {
  return ALLOWLIST_RE.test(text.trim());
}

function auditFile(file) {
  const src = fs.readFileSync(file, 'utf8');
  const lines = src.split('\n');
  const findings = [];

  lines.forEach((line, i) => {
    // Skip lines that already resolve through the dictionary/bilingual helpers —
    // a literal alongside a t()/pickText call on the same line is usually a label,
    // fallback, or already-handled case, not a miss.
    if (/\bt\(|pickText\(|pickField\(|translate\(/.test(line)) return;

    let m;
    ATTR_RE.lastIndex = 0;
    while ((m = ATTR_RE.exec(line))) {
      if (!isAllowlisted(m[2])) {
        findings.push({ line: i + 1, kind: m[1], text: m[2] });
      }
    }
    JSX_TEXT_RE.lastIndex = 0;
    while ((m = JSX_TEXT_RE.exec(line))) {
      if (!isAllowlisted(m[1])) {
        findings.push({ line: i + 1, kind: 'jsx-text', text: m[1] });
      }
    }
  });

  return findings;
}

function main() {
  const files = walk(SRC);
  let total = 0;
  for (const file of files) {
    const findings = auditFile(file);
    if (findings.length === 0) continue;
    total += findings.length;
    console.log(path.relative(process.cwd(), file));
    for (const f of findings) {
      console.log(`  ${f.line}: [${f.kind}] ${f.text}`);
    }
  }
  console.log(`\n${total} candidate hard-coded string(s) found across ${files.length} .tsx files.`);
  process.exitCode = total > 0 ? 1 : 0;
}

main();
