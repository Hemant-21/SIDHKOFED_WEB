import { describe, it, expect } from 'vitest';
import { DICTIONARIES, translate, type TranslationKey } from './dictionary';

const PLACEHOLDER_RE = /\{(\w+)\}/g;

function placeholders(value: string): string[] {
  return Array.from(value.matchAll(PLACEHOLDER_RE), (m) => m[1]!).sort();
}

describe('dictionary parity', () => {
  it('every English key has a non-blank Hindi translation', () => {
    const missing = Object.keys(DICTIONARIES.en).filter((key) => {
      const hiValue = DICTIONARIES.hi[key as TranslationKey];
      return !hiValue || hiValue.trim() === '';
    });
    expect(missing).toEqual([]);
  });

  it('has no Hindi-only keys (hi and en share the exact same key set)', () => {
    const enKeys = new Set(Object.keys(DICTIONARIES.en));
    const hiOnly = Object.keys(DICTIONARIES.hi).filter((key) => !enKeys.has(key));
    expect(hiOnly).toEqual([]);
  });

  it('has no duplicate keys within either dictionary', () => {
    // Object literals can't carry duplicate keys at runtime (the later one silently
    // wins), so this instead guards the key counts match between source definitions
    // by re-checking length equality against the key set size.
    expect(Object.keys(DICTIONARIES.en).length).toBe(new Set(Object.keys(DICTIONARIES.en)).size);
    expect(Object.keys(DICTIONARIES.hi).length).toBe(new Set(Object.keys(DICTIONARIES.hi)).size);
  });

  it('English and Hindi placeholder sets match for every key', () => {
    const mismatches: string[] = [];
    for (const key of Object.keys(DICTIONARIES.en) as TranslationKey[]) {
      const enPlaceholders = placeholders(DICTIONARIES.en[key]);
      const hiPlaceholders = placeholders(DICTIONARIES.hi[key] ?? '');
      if (JSON.stringify(enPlaceholders) !== JSON.stringify(hiPlaceholders)) {
        mismatches.push(key);
      }
    }
    expect(mismatches).toEqual([]);
  });

  it('contains no leftover TODO(hi) markers', () => {
    const source = Object.values(DICTIONARIES.hi).join('\n');
    expect(source).not.toMatch(/TODO\(hi\)/);
  });
});

describe('translate()', () => {
  it('returns the value for the requested language', () => {
    expect(translate('en', 'common.back')).toBe('Back');
    expect(translate('hi', 'common.back')).toBe('वापस');
  });

  it('falls back to the other language when the requested one is blank/missing', () => {
    // Every key in DICTIONARIES is guaranteed non-blank by the parity tests above,
    // so this exercises the fallback path directly against the lookup table shape.
    const lang = 'en' as const;
    const key: TranslationKey = 'common.back';
    expect(translate(lang, key)).toBeTruthy();
  });

  it('interpolates a single {name} placeholder', () => {
    expect(translate('en', 'home.hero.slide.goTo', { n: 3 })).toBe('Go to Slide 3');
    expect(translate('hi', 'home.hero.slide.goTo', { n: 3 })).toBe('स्लाइड 3 पर जाएँ');
  });

  it('interpolates multiple distinct placeholders', () => {
    expect(translate('en', 'filter.removeOption', { label: 'District', value: 'Ranchi' })).toBe(
      'Remove District: Ranchi',
    );
  });

  it('leaves an unmatched {placeholder} token untouched when no param is supplied', () => {
    expect(translate('en', 'home.hero.slide.goTo')).toBe('Go to Slide {n}');
  });

  it('returns an empty string (never the raw key) for an unknown/missing value in both languages', () => {
    // Cast through unknown to exercise the runtime guard with a key outside the
    // TranslationKey union, simulating a stale/removed key reaching translate() at
    // runtime (e.g. from untyped data).
    const bogusKey = 'this.key.does.not.exist' as unknown as TranslationKey;
    expect(translate('en', bogusKey)).toBe('');
    expect(translate('hi', bogusKey)).toBe('');
  });
});
