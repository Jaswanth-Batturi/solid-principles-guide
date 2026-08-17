#!/usr/bin/env node
/** Ensure every principle runDemo bundles to exactly one Java file for OneCompiler. */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { principleCode } from '../src/data/principles/principle-code.ts';

function javaToCompilerFiles(code) {
  const trimmed = code.trim();
  const publicClass = trimmed.match(/^public\s+class\s+(\w+)/m);
  const name = publicClass ? `${publicClass[1]}.java` : 'Main.java';
  return [{ name, content: trimmed }];
}

let failed = 0;

for (const [slug, entry] of Object.entries(principleCode)) {
  const code = entry.runDemo;
  const files = javaToCompilerFiles(code);
  if (files.length !== 1) {
    console.error(`FAIL ${slug}: ${files.length} files — OneCompiler Run will break`);
    failed++;
  }
  if (!/public\s+static\s+void\s+main\s*\(/m.test(files[0].content)) {
    console.error(`FAIL ${slug}: bundled file missing main()`);
    failed++;
  }
}

if (failed > 0) process.exit(1);
console.log('OK — all runDemo snippets bundle to a single Java file with main().');
