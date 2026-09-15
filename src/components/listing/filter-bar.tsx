'use client';

/**
 * Backend-driven filter bar for listing pages. Filter option data (masters,
 * programmes, years) is fetched server-side and passed in; this island only syncs
 * the active selection to the URL query string (shareable, back-button friendly).
 * Search is debounced; multi-selects commit with Apply. Only supported query
 * fields are exposed by each page.
 */

import { useEffect, useRef, useState } from 'react';
import { useQueryParams } from '@/hooks/use-query-params';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { SearchInput } from '@/components/ui/search-input';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import { Button } from '@/components/ui/button';

export interface FilterOption {
  value: string;
  name_en: string;
  name_hi?: string | null;
}

export interface FilterSelect {
  /** Enable only for API fields that accept comma-separated alternatives. */
  multiple?: boolean;
  /** Query-string key, e.g. `event_type`. */
  key: string;
  /** i18n key for the field label, e.g. `filter.type`. */
  labelKey: string;
  options: FilterOption[];
}

export function FilterBar({
  selects = [],
  searchable = true,
  searchPlaceholderKey = 'search.placeholder',
}: {
  selects?: FilterSelect[];
  searchable?: boolean;
  searchPlaceholderKey?: string;
}) {
  const { get, setParams, clearParams, searchParams } = useQueryParams();
  const { t, language } = useLanguage();

  const [term, setTerm] = useState(() => get('search'));
  const timer = useRef<ReturnType<typeof setTimeout>>();
  const updateParams = useRef(setParams);
  updateParams.current = setParams;
  const urlSearch = get('search');

  // Back/forward and category navigation restore the search field without
  // scheduling a stale search that could overwrite the new filter selection.
  useEffect(() => {
    clearTimeout(timer.current);
    setTerm(urlSearch);
  }, [urlSearch]);
  useEffect(() => () => clearTimeout(timer.current), []);

  function changeSearch(value: string) {
    setTerm(value);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => updateParams.current({ search: value || null }), 350);
  }

  const hasActive = Array.from(searchParams.keys()).some((k) => k !== 'page');

  return (
    <div className="rounded-lg border border-border bg-surface p-4">
      <div className="flex flex-col gap-4 md:flex-row md:flex-wrap md:items-end">
        {searchable && (
          <div className="min-w-0 flex-1 md:min-w-[16rem]">
            <SearchInput
              id="listing-search"
              label={t('nav.search')}
              value={term}
              onChange={changeSearch}
              placeholder={t(searchPlaceholderKey)}
            />
          </div>
        )}

        {selects.map((s) => s.multiple ? (
          <MultiSelect
            key={s.key}
            id={`filter-${s.key}`}
            label={t(s.labelKey)}
            value={get(s.key).split(',').filter(Boolean)}
            onChange={(values) => setParams({ [s.key]: values.join(',') || null })}
            placeholder={t('common.all')}
            applyLabel={language === 'hi' ? 'लागू करें' : 'Apply'}
            clearLabel={language === 'hi' ? 'सभी हटाएँ' : 'Clear selection'}
            options={s.options.map((o) => ({ value: o.value, label: pickText(o.name_en, o.name_hi ?? null, language) }))}
            className="md:w-56"
          />
        ) : (
          <Select
            key={s.key}
            id={`filter-${s.key}`}
            label={t(s.labelKey)}
            value={get(s.key)}
            onChange={(v) => setParams({ [s.key]: v || null })}
            placeholder={t('common.all')}
            options={s.options.map((o) => ({
              value: o.value,
              label: pickText(o.name_en, o.name_hi ?? null, language),
            }))}
            className="md:w-56"
          />
        ))}

        {hasActive && (
          <Button
            variant="outline"
            onClick={() => {
              clearTimeout(timer.current);
              setTerm('');
              clearParams();
            }}
          >
            {t('common.clearFilters')}
          </Button>
        )}
      </div>
      {selects.some((s) => s.multiple) && (
        <p className="mt-3 text-xs text-muted-foreground">
          {language === 'hi' ? 'एक फ़िल्टर में कई विकल्प चुन सकते हैं। परिणाम हर लागू फ़िल्टर से मेल खाते हैं।' : 'Choose one or more options per filter. Results match every applied filter.'}
        </p>
      )}
      {hasActive && (
        <div aria-label={language === 'hi' ? 'लागू फ़िल्टर' : 'Applied filters'} className="mt-3 flex flex-wrap gap-2">
          {selects.flatMap((s) => get(s.key).split(',').filter(Boolean).map((value) => {
            const option = s.options.find((o) => o.value === value);
            const label = option ? pickText(option.name_en, option.name_hi ?? null, language) : value;
            return <button key={`${s.key}-${value}`} type="button"
              aria-label={`${language === 'hi' ? 'हटाएँ' : 'Remove'} ${t(s.labelKey)}: ${label}`}
              onClick={() => setParams({ [s.key]: get(s.key).split(',').filter((v) => v !== value).join(',') || null })}
              className="rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs text-primary hover:bg-primary/10">
              {t(s.labelKey)}: {label} <span aria-hidden="true">×</span>
            </button>;
          }))}
        </div>
      )}
    </div>
  );
}
