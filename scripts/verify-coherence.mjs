#!/usr/bin/env node
/**
 * Ensure enriched principle pages have run guidance and println in demos.
 */
import { readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const dist = join(import.meta.dirname, '..', 'dist');
const codePath = join(import.meta.dirname, '..', 'src/data/principles/principle-code.ts');
const codeSrc = readFileSync(codePath, 'utf8');

const slugs = [
  'single-responsibility',
  'open-closed',
  'liskov-substitution',
  'interface-segregation',
  'dependency-inversion',
];

let failed = 0;

for (const slug of slugs) {
  const htmlPath = join(dist, 'principles', slug, 'index.html');
  if (!existsSync(htmlPath)) {
    console.error(`MISSING dist page: ${slug}`);
    failed++;
    continue;
  }
  const html = readFileSync(htmlPath, 'utf8');
  if (!html.includes('Copy editor code')) {
    console.error(`MISSING copy editor button: ${slug}`);
    failed++;
  }
  const expectMatch = html.match(/data-run-expect[^>]*>([^<]+)</);
  if (!expectMatch?.[1]?.trim()) {
    console.error(`EMPTY runExpect in HTML: ${slug}`);
    failed++;
  }
  const slugMarker = `'${slug}': withDemo(`;
  const start = codeSrc.indexOf(slugMarker);
  if (start === -1) {
    console.error(`MISSING code entry: ${slug}`);
    failed++;
    continue;
  }
  const slice = codeSrc.slice(start, start + 6000);
  const demoStart = slice.lastIndexOf('`', slice.indexOf('public class'));
  const demoEnd = slice.indexOf('`', demoStart + 1);
  const afterBlock = slice.slice(demoStart, demoEnd);
  if (!/System\.out\.println/.test(afterBlock)) {
    console.error(`NO println in codeAfter: ${slug}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} coherence check(s) failed.`);
  process.exit(1);
}

console.log(`OK — ${slugs.length} principles have run guidance and println demos.`);
