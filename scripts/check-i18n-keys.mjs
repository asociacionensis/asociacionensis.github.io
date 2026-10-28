/**
 * Verifies that every locale file matches src/i18n/es.json in structure:
 * identical flattened key paths and identical {{placeholder}} sets per key.
 *
 * It also verifies that every key used in the code exists in the source
 * dictionary: a missing key would otherwise print the raw key name on the
 * live page, with the only warning buried in the build log.
 *
 * Usage: node scripts/check-i18n-keys.mjs [locale.json ...]
 */

import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';

const ROOT = path.resolve(import.meta.dirname, '..');
const I18N_DIR = path.join(ROOT, 'src', 'i18n');
const SRC_DIR = path.join(ROOT, 'src');
const SOURCE = 'es.json';

const PLACEHOLDER_RE = /\{\{\s*[\w.]+\s*\}\}/g;
/** `t('key')` and `t('key', { ... })`, but not `import('...')`. */
const USED_KEY_RE = /(?<![\w.$])t\(\s*'([^']+)'/g;

/** Flattens a nested object into dotted paths, collecting type errors. */
function flatten(node, prefix = '', out = new Map()) {
  if (node === null || typeof node !== 'object' || Array.isArray(node)) {
    out.set(prefix, node);
    return out;
  }
  for (const [key, value] of Object.entries(node)) {
    flatten(value, prefix ? `${prefix}.${key}` : key, out);
  }
  return out;
}

function placeholders(value) {
  return new Set(typeof value === 'string' ? (value.match(PLACEHOLDER_RE) ?? []) : []);
}

/** Every `t('...')` key literal used in the source tree. */
async function collectUsedKeys(dir) {
  const keys = new Set();

  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      for (const key of await collectUsedKeys(full)) keys.add(key);
    } else if (/\.(astro|ts)$/.test(entry.name)) {
      const source = await readFile(full, 'utf8');
      for (const match of source.matchAll(USED_KEY_RE)) keys.add(match[1]);
    }
  }

  return keys;
}

const locales = process.argv.slice(2);
if (locales.length === 0) locales.push('ca.json');

const sourceRaw = JSON.parse(await readFile(path.join(I18N_DIR, SOURCE), 'utf8'));
const source = flatten(sourceRaw);
const sourceKeys = [...source.keys()];
const sourceSet = new Set(sourceKeys);

console.log(`source: ${SOURCE} — ${sourceKeys.length} keys`);
console.log(`locales checked: ${locales.join(', ')}\n`);

let failures = 0;

for (const locale of locales) {
  const problems = [];
  let target;

  try {
    target = flatten(JSON.parse(await readFile(path.join(I18N_DIR, locale), 'utf8')));
  } catch (error) {
    console.log(`FAIL  ${locale}: unreadable or invalid JSON — ${error.message}`);
    failures += 1;
    continue;
  }

  // 1. key sets identical
  const targetSet = new Set(target.keys());
  const missing = sourceKeys.filter((k) => !targetSet.has(k));
  const extra = [...target.keys()].filter((k) => !sourceSet.has(k));
  for (const k of missing) problems.push(`missing key: ${k}`);
  for (const k of extra) problems.push(`extra key: ${k}`);

  // 2. placeholder sets match per key
  for (const [key, value] of target) {
    if (!sourceSet.has(key)) continue;
    const expected = placeholders(source.get(key));
    const actual = placeholders(value);
    const delta = [
      ...[...expected].filter((p) => !actual.has(p)).map((p) => `-${p}`),
      ...[...actual].filter((p) => !expected.has(p)).map((p) => `+${p}`),
    ];
    if (delta.length > 0) {
      problems.push(`placeholder mismatch at ${key}: expected {${[...expected].join(', ')}} got {${[...actual].join(', ')}}`);
    }
  }

  // 3. empty values
  for (const [key, value] of target) {
    if (typeof value !== 'string' || value.trim() === '') {
      problems.push(`empty or non-string value at ${key}`);
    }
  }

  if (problems.length === 0) {
    console.log(`PASS  ${locale} — ${target.size} keys, key sets identical, placeholders identical`);
  } else {
    failures += 1;
    console.log(`FAIL  ${locale} — ${problems.length} difference(s):`);
    for (const p of problems) console.log(`        ${p}`);
  }
}

// 4. keys used in the code exist in the source dictionary
const used = await collectUsedKeys(SRC_DIR);
const missingInCode = [...used].filter((k) => !sourceSet.has(k));

if (missingInCode.length > 0) {
  failures += 1;
  console.log(`FAIL  code — ${missingInCode.length} key(s) used in the code are missing from ${SOURCE}:`);
  for (const k of missingInCode) console.log(`        missing key: ${k}`);
} else {
  console.log(`PASS  code — ${used.size} key(s) used in the code all exist in ${SOURCE}`);
}

console.log(`\ndifferences: ${failures}`);
process.exit(failures === 0 ? 0 : 1);
