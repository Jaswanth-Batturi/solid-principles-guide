#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const slugs = [
  'single-responsibility',
  'open-closed',
  'liskov-substitution',
  'interface-segregation',
  'dependency-inversion',
];

const text = readFileSync(
  join(import.meta.dirname, '..', 'src/data/principles/principle-stories.ts'),
  'utf8',
);
const found = [...text.matchAll(/^\s{2}['"]?([\w-]+)['"]?:\s*\{/gm)].map((m) => m[1]);

let failed = 0;
for (const slug of slugs) {
  if (!found.includes(slug)) {
    console.error(`MISSING story: ${slug}`);
    failed++;
  }
}

if (failed) process.exit(1);
console.log(`OK — ${slugs.length} connected stories defined.`);
