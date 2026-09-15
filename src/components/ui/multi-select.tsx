'use client';

import { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/utils/cn';
import type { SelectOption } from './select';

/** Checkbox dropdown with an explicit Apply action, including keyboard support. */
export function MultiSelect({ value, onChange, options, label, id, placeholder, applyLabel, clearLabel, className }: {
  value: string[];
  onChange: (value: string[]) => void;
  options: SelectOption[];
  label: string;
  id: string;
  placeholder: string;
  applyLabel: string;
  clearLabel: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState(value);
  const root = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const selectionKey = value.join(',');

  useEffect(() => { setOpen(false); }, [selectionKey]);
  useEffect(() => {
    if (!open) return;
    const dismiss = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [open]);

  // Retain selections from shared links even if a master has since been deactivated.
  const choices = [...options, ...value.filter((v) => !options.some((o) => o.value === v)).map((v) => ({ value: v, label: v }))];
  const names = value.map((v) => choices.find((o) => o.value === v)?.label ?? v);
  return (
    <div ref={root} className={cn('relative flex flex-col gap-1', className)}
      onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget as Node)) setOpen(false); }}
      onKeyDown={(event) => {
        if (event.key === 'Escape' && open) { event.preventDefault(); setOpen(false); trigger.current?.focus(); }
      }}>
      <label htmlFor={id} className="text-xs font-medium text-muted-foreground">{label}</label>
      <button ref={trigger} id={id} type="button" aria-expanded={open} aria-controls={`${id}-options`}
        onClick={() => { setDraft(value); setOpen(!open); }}
        className="flex h-10 w-full items-center justify-between gap-2 rounded-md border border-input bg-surface px-3 text-left text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className="truncate" title={names.join(', ')}>{names.length === 0 ? placeholder : names.length === 1 ? names[0] : `${names[0]} +${names.length - 1}`}</span>
        <ChevronDown className="h-4 w-4 shrink-0" aria-hidden="true" />
      </button>
      {open && (
        <div id={`${id}-options`} role="group" aria-label={label}
          className="absolute left-0 top-full z-30 mt-1 w-full min-w-56 rounded-md border border-border bg-surface p-2 shadow-lg">
          <div className="max-h-60 overflow-y-auto">
            {choices.map((option) => (
              <label key={option.value} className="flex cursor-pointer items-start gap-2 rounded px-2 py-2 text-sm hover:bg-muted">
                <input type="checkbox" checked={draft.includes(option.value)} className="mt-0.5 h-4 w-4 shrink-0 accent-primary"
                  onChange={(event) => setDraft((previous) => event.target.checked ? [...previous, option.value] : previous.filter((v) => v !== option.value))} />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 border-t border-border pt-2">
            <button type="button" className="rounded px-2 py-1.5 text-sm hover:bg-muted" onClick={() => setDraft([])}>{clearLabel}</button>
            <button type="button" className="rounded bg-primary px-3 py-1.5 text-sm text-primary-foreground"
              onClick={() => { onChange(draft); setOpen(false); trigger.current?.focus(); }}>{applyLabel}</button>
          </div>
        </div>
      )}
    </div>
  );
}
