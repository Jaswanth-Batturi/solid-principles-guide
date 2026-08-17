#!/usr/bin/env node
/**
 * Smoke-test built static site: every principle page and key assets must exist.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist');
const base = '/solid-principles-guide';

const slugs = [
  'single-responsibility',
  'open-closed',
  'liskov-substitution',
  'interface-segregation',
  'dependency-inversion',
];

const required = [
  'index.html',
  '404.html',
  'og-image.jpg',
  ...slugs.map((s) => `principles/${s}/index.html`),
];

let failed = 0;

for (const file of required) {
  const path = join(dist, file);
  if (!existsSync(path)) {
    console.error(`MISSING: ${file}`);
    failed++;
  }
}

const indexHtml = readFileSync(join(dist, 'index.html'), 'utf8');
if (!indexHtml.includes('SOLID')) {
  console.error('MISSING: homepage branding');
  failed++;
}
if (indexHtml.includes('href="/principles/')) {
  console.error('BROKEN LINK: absolute /principles/ without base path in index');
  failed++;
}
if (!indexHtml.includes(`${base}/principles/single-responsibility`)) {
  console.error('BROKEN LINK: expected base-prefixed principle URLs');
  failed++;
}

const srpHtml = readFileSync(join(dist, 'principles/single-responsibility/index.html'), 'utf8');
if (!srpHtml.includes('shiki') && !srpHtml.includes('github-dark')) {
  if (!srpHtml.includes('color:')) {
    console.error('MISSING: syntax highlighting on SRP page');
    failed++;
  }
}
if (!srpHtml.includes('data-oc-frame')) {
  console.error('MISSING: OneCompiler runner on SRP page');
  failed++;
}
if (srpHtml.includes('(view: string)')) {
  console.error('BROKEN JS: TypeScript left in CodeToggle script');
  failed++;
}
if (!srpHtml.includes('scene-card') && !srpHtml.includes('Real-life analogy')) {
  console.error('MISSING: real-life scene on SRP page');
  failed++;
}

if (failed > 0) {
  console.error(`\n${failed} check(s) failed.`);
  process.exit(1);
}

console.log(`OK — ${slugs.length} principles, assets, links, highlighting, and runner verified.`);
