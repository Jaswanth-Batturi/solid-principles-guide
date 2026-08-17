#!/usr/bin/env node
/**
 * Fail if built site still contains design-patterns branding or copy.
 */
import { readFileSync, existsSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist');
const ogImage = join(dist, 'og-solid-principles.jpg');

const forbidden = [
  'Patterns in Practice',
  'Learn design patterns',
  'design patterns with Java',
  'Pattern finder',
  'without the pattern',
  'skip the pattern',
  'With the pattern',
  'Pattern navigation',
  'Browse patterns',
  'pattern library',
];

function walkHtml(dir, files = []) {
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) walkHtml(full, files);
    else if (entry.name.endsWith('.html')) files.push(full);
  }
  return files;
}

let failed = 0;

if (!existsSync(ogImage)) {
  console.error('MISSING og-solid-principles.jpg');
  failed++;
} else {
  const size = readFileSync(ogImage).length;
  // Old design-patterns og-image was ~181KB; new SOLID image is ~147KB
  if (size > 175000) {
    console.error(`STALE og-solid-principles.jpg (${size} bytes) — still the design-patterns image`);
    failed++;
  }
}

for (const file of walkHtml(dist)) {
  const html = readFileSync(file, 'utf8');
  const rel = file.replace(dist, '');
  for (const phrase of forbidden) {
    if (html.includes(phrase)) {
      console.error(`FORBIDDEN "${phrase}" in ${rel}`);
      failed++;
    }
  }
}

if (failed > 0) {
  console.error(`\n${failed} branding check(s) failed.`);
  process.exit(1);
}

console.log('OK — no stale design-patterns branding in built site.');
