'use client';

/**
 * Toolkit information disclosure — shared across all three reports' main rows and drill-downs.
 * Mirrors the CMS's `ToolkitInfoButton`/`Dialog` exactly: a "Toolkit" button opens a modal titled
 * "Toolkit — {title}" showing the fixed column set (Item, distribution pattern, default group
 * size, default quantity with unit, status). Quantities are explicitly labelled as catalogue
 * defaults, never a historical actual.
 */
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { Info, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ToolkitInfo, ToolkitItemStatus } from '@/lib/types/reports';

const STATUS_TONE: Record<ToolkitItemStatus, 'success' | 'warning' | 'danger' | 'neutral'> = {
  distributed: 'success',
  partially_distributed: 'warning',
  not_distributed: 'danger',
  not_recorded: 'neutral',
};

const STATUS_LABEL: Record<ToolkitItemStatus, string> = {
  distributed: 'Distributed',
  partially_distributed: 'Partially distributed',
  not_distributed: 'Not distributed',
  not_recorded: 'Not recorded',
};

export function ToolkitDisclosure({ title, toolkit }: { title: string; toolkit: ToolkitInfo }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    if (open) {
      document.body.style.overflow = 'hidden';
      document.addEventListener('keydown', onKey);
    }
    return () => {
      document.body.style.overflow = '';
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
      >
        <Info className="h-3.5 w-3.5" />
        Toolkit
      </button>
      {open && mounted
        ? createPortal(
            <div
              role="dialog"
              aria-modal="true"
              aria-label={`Toolkit — ${title}`}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
              onClick={() => setOpen(false)}
            >
              <div
                className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-border bg-surface p-5 shadow-xl"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <h3 className="text-base font-semibold text-foreground">Toolkit — {title}</h3>
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    aria-label="Close"
                    className="inline-flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <ToolkitInfoContent toolkit={toolkit} />
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function ToolkitInfoContent({ toolkit }: { toolkit: ToolkitInfo }) {
  if (!toolkit.applicable) {
    return <p className="py-4 text-sm text-muted-foreground">N/A — no toolkit is attached to this scope.</p>;
  }
  if (toolkit.items.length === 0) {
    return <p className="py-4 text-sm text-muted-foreground">Not recorded — no distribution evidence found.</p>;
  }
  return (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">
        Default group size and quantity are catalogue defaults from the toolkit item definition, not historical
        actuals.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border text-left text-xs text-muted-foreground">
              <th className="py-1.5 pr-3">Item</th>
              <th className="py-1.5 pr-3">Pattern</th>
              <th className="py-1.5 pr-3">Default group size</th>
              <th className="py-1.5 pr-3">Default quantity</th>
              <th className="py-1.5 pr-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {toolkit.items.map((item) => (
              <tr key={item.toolkitItemId} className="border-b border-border/50 last:border-0">
                <td className="py-1.5 pr-3 font-medium text-foreground">{item.itemNameEn}</td>
                <td className="py-1.5 pr-3 capitalize text-muted-foreground">{item.distributionPattern}</td>
                <td className="py-1.5 pr-3 text-muted-foreground">
                  {item.distributionPattern === 'group' ? (item.defaultGroupSize ?? '—') : '—'}
                </td>
                <td className="py-1.5 pr-3 text-muted-foreground">
                  {item.defaultQuantityPerUnit === null ? '—' : `${item.defaultQuantityPerUnit} ${item.unit ?? ''}`.trim()}
                </td>
                <td className="py-1.5 pr-3">
                  <Badge tone={STATUS_TONE[item.status]}>{STATUS_LABEL[item.status]}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
