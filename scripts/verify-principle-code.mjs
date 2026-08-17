#!/usr/bin/env node
/**
 * Verify principle-code.ts entries are runnable single-file Java with main().
 */
import { principleCode } from '../src/data/principles/principle-code.ts';

const slugs = Object.keys(principleCode);
let failed = 0;

for (const slug of slugs) {
  const entry = principleCode[slug];
  if (!entry.codeBefore.includes('public static void main')) {
    console.error(`MISSING main in codeBefore: ${slug}`);
    failed++;
  }
  if (!entry.codeAfter.includes('public static void main')) {
    console.error(`MISSING main in codeAfter: ${slug}`);
    failed++;
  }
  if (entry.runDemo !== entry.codeAfter) {
    console.error(`runDemo !== codeAfter: ${slug}`);
    failed++;
  }
  if (!/^public class \w+/m.test(entry.codeAfter)) {
    console.error(`codeAfter missing public class: ${slug}`);
    failed++;
  }
}

if (failed > 0) {
  console.error(`\n${failed} principle-code check(s) failed.`);
  process.exit(1);
}

console.log(`OK — ${slugs.length} principles have runnable before/after code.`);
