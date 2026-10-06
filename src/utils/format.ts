/**
 * Pure formatting helpers (no framework/DB deps). Dates are rendered for display
 * only; the API already returns `YYYY-MM-DD` (dates) and ISO-8601 (timestamps).
 */

import type { Language, TranslationKey } from '@/i18n/dictionary';

const LOCALE: Record<Language, string> = { en: 'en-IN', hi: 'hi-IN' };

/** Format an ISO date/timestamp string for display. Returns '' for null/invalid. */
export function formatDate(
  value: string | null | undefined,
  lang: Language = 'en',
  opts: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' },
): string {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return new Intl.DateTimeFormat(LOCALE[lang], opts).format(d);
}

/** Format a date range; collapses to a single date when end is missing/equal. */
export function formatDateRange(
  start: string | null | undefined,
  end: string | null | undefined,
  lang: Language = 'en',
): string {
  const s = formatDate(start, lang);
  if (!end || end === start) return s;
  return `${s} – ${formatDate(end, lang)}`;
}

/** Number formatting with thousands separators (Indian locale). */
export function formatNumber(value: number | string | null | undefined, lang: Language = 'en'): string {
  if (value === null || value === undefined || value === '') return '';
  const n = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(n)) return String(value);
  return new Intl.NumberFormat(LOCALE[lang]).format(n);
}

/** Truncate plain text to a max length on a word boundary, adding an ellipsis. */
export function truncate(text: string | null | undefined, max = 160): string {
  if (!text) return '';
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const lastSpace = cut.lastIndexOf(' ');
  return `${cut.slice(0, lastSpace > 0 ? lastSpace : max).trimEnd()}…`;
}

/** Human-readable file size, e.g. `2.4 MB`. Returns '' for missing/invalid sizes. */
export function formatFileSize(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || Number.isNaN(bytes) || bytes < 0) return '';
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${exponent === 0 ? value : value.toFixed(1)} ${units[exponent]}`;
}

/** Short format label from a MIME type, e.g. `application/pdf` -> `PDF`. */
export function formatFileType(mimeType: string | null | undefined): string {
  if (!mimeType) return '';
  const subtype = mimeType.split('/')[1] ?? mimeType;
  const known: Record<string, string> = {
    'vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
    'vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
    'vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
    msword: 'DOC',
    'vnd.ms-excel': 'XLS',
    'vnd.ms-powerpoint': 'PPT',
    jpeg: 'JPG',
  };
  return (known[subtype] ?? subtype).toUpperCase();
}

/** Human label from an enum-like value: `single_date` -> `Single date`. */
export function humanizeEnum(value: string | null | undefined): string {
  if (!value) return '';
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/** Toolkit item `distribution_basis` -> its dictionary label, falling back to
 *  `humanizeEnum` for an unrecognised value (see codex §11). */
export function distributionBasisLabel(value: string | null | undefined, t: (key: TranslationKey) => string): string {
  if (value === 'individual') return t('enum.distributionBasis.individual');
  if (value === 'group') return t('enum.distributionBasis.group');
  return humanizeEnum(value);
}

const CONTENT_TYPE_KEYS: Record<string, TranslationKey> = {
  event: 'enum.contentType.event',
  news: 'enum.contentType.news',
  programme: 'enum.contentType.programme',
  document: 'enum.contentType.document',
  official_communication: 'enum.contentType.officialCommunication',
  tender: 'enum.contentType.tender',
  procurement_update: 'enum.contentType.procurementUpdate',
  page: 'enum.contentType.page',
};

/** Search result `content_type` -> its dictionary label, falling back to
 *  `humanizeEnum` for an unrecognised value (see codex §11). */
export function contentTypeLabel(value: string | null | undefined, t: (key: TranslationKey) => string): string {
  const key = value ? CONTENT_TYPE_KEYS[value] : undefined;
  return key ? t(key) : humanizeEnum(value);
}
