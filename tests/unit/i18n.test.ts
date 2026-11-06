import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { locales, type Locale } from '@/i18n/config';

/**
 * Translation completeness. English is the source of truth for keys; every
 * other language must have exactly the same shape (keys, array lengths) and no
 * empty or untranslated-placeholder strings.
 */

const root = path.resolve(__dirname, '../../src/i18n');

function readJson(file: string): unknown {
  return JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
}

function listJson(dir: string): string[] {
  const full = path.join(root, dir);
  const out: string[] = [];
  for (const entry of fs.readdirSync(full, { withFileTypes: true })) {
    const rel = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listJson(rel));
    else if (entry.name.endsWith('.json')) out.push(rel);
  }
  return out.sort();
}

/** Flattens to `path → string` and records array lengths as `path#length`. */
function shape(value: unknown, prefix = ''): Map<string, string> {
  const out = new Map<string, string>();
  if (Array.isArray(value)) {
    out.set(`${prefix}#length`, String(value.length));
    value.forEach((item, i) => {
      for (const [k, v] of shape(item, `${prefix}[${i}]`)) out.set(k, v);
    });
  } else if (value && typeof value === 'object') {
    for (const [key, item] of Object.entries(value)) {
      for (const [k, v] of shape(item, prefix ? `${prefix}.${key}` : key)) out.set(k, v);
    }
  } else {
    out.set(prefix, String(value));
  }
  return out;
}

const others = locales.filter((l): l is Exclude<Locale, 'en'> => l !== 'en');

/** `{name}` and `{count, plural, …}` arguments plus `<tag>` rich-text tags. */
function placeholders(text: string): string[] {
  // An argument is `{name}` or `{name, plural, …}`; plural branches like
  // `{One system}` have a space after the first word and are not arguments.
  const args = [...text.matchAll(/\{\s*([a-zA-Z_]+)\s*[,}]/g)].map((m) => `{${m[1]}}`);
  const tags = [...text.matchAll(/<\/?([a-z]+)>/g)].map((m) => `<${m[1]}>`);
  return [...new Set([...args, ...tags])].sort();
}

describe('UI messages', () => {
  const en = shape(readJson('messages/en.json'));

  it('has no empty strings in English', () => {
    for (const [key, value] of en) expect(value.trim(), key).not.toBe('');
  });

  describe.each(others)('%s', (locale) => {
    const other = shape(readJson(`messages/${locale}.json`));

    it('has exactly the same keys and list lengths as English', () => {
      const missing = [...en.keys()].filter((k) => !other.has(k));
      const extra = [...other.keys()].filter((k) => !en.has(k));
      expect({ missing, extra }).toEqual({ missing: [], extra: [] });
    });

    it('has no empty strings', () => {
      for (const [key, value] of other) expect(value.trim(), key).not.toBe('');
    });

    it('keeps every placeholder and rich-text tag', () => {
      for (const [key, value] of en) {
        if (key.endsWith('#length')) continue;
        expect(placeholders(other.get(key) ?? ''), key).toEqual(placeholders(value));
      }
    });
  });
});

describe('content translations', () => {
  const files = listJson('content/en').map((f) => path.relative('content/en', f));

  it('has English source files', () => {
    expect(files.length).toBeGreaterThan(10);
  });

  describe.each(others)('%s', (locale) => {
    it('has a file for every English file, with the same shape', () => {
      const present = listJson(`content/${locale}`).map((f) => path.relative(`content/${locale}`, f));
      expect(present).toEqual(files);

      for (const file of files) {
        const en = shape(readJson(`content/en/${file}`));
        const other = shape(readJson(`content/${locale}/${file}`));
        const missing = [...en.keys()].filter((k) => !other.has(k));
        const extra = [...other.keys()].filter((k) => !en.has(k));
        expect({ file, missing, extra }).toEqual({ file, missing: [], extra: [] });
        for (const [key, value] of other) {
          expect(value.trim(), `${file} → ${key}`).not.toBe('');
        }
      }
    });
  });
});
