'use client';

import { cn } from '@/utils/cn';
import { humanizeEnum } from '@/utils/format';
import { useLanguage } from '@/providers/language-provider';
import type { TranslationKey } from '@/i18n/dictionary';

type Tone = 'neutral' | 'primary' | 'accent' | 'success' | 'warning' | 'danger' | 'info';

const tones: Record<Tone, string> = {
  neutral: 'bg-muted text-muted-foreground',
  primary: 'bg-primary/10 text-primary',
  // Full-strength --accent as *text* on a light tint fails contrast (~3:1); the
  // darker, text-safe --accent-action token is used here instead (§A / audit 1.4).
  accent: 'bg-accent/10 text-accent-action',
  success: 'bg-success/10 text-success',
  // --warning as text (the off-palette amber) also fails contrast on its own light
  // tint; --olive is the text-safe substitute. --warning stays reserved for filled
  // (solid-background) use only.
  warning: 'bg-warning/15 text-olive',
  danger: 'bg-danger/10 text-danger',
  info: 'bg-info/10 text-info',
};

export function Badge({
  children,
  tone = 'neutral',
  className,
}: {
  children: React.ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

/** Map highlight types (codex §9) to a tone, and render a labelled badge. */
const HIGHLIGHT_TONE: Record<string, Tone> = {
  new: 'info',
  latest: 'primary',
  important: 'warning',
  urgent: 'danger',
  featured: 'accent',
};

const HIGHLIGHT_KEY: Record<string, TranslationKey> = {
  new: 'badge.highlight.new',
  latest: 'badge.highlight.latest',
  important: 'badge.highlight.important',
  urgent: 'badge.highlight.urgent',
  featured: 'badge.highlight.featured',
};

export function HighlightBadge({ type, className }: { type: string | null | undefined; className?: string }) {
  const { t } = useLanguage();
  if (!type) return null;
  const key = HIGHLIGHT_KEY[type];
  const label = key ? t(key) : humanizeEnum(type);
  return (
    <Badge tone={HIGHLIGHT_TONE[type] ?? 'neutral'} className={className}>
      {label}
    </Badge>
  );
}

/** Event/tender/procurement status → tone. Status text is never color-only (WCAG). */
const STATUS_TONE: Record<string, Tone> = {
  scheduled: 'info',
  upcoming: 'info',
  ongoing: 'success',
  completed: 'neutral',
  postponed: 'warning',
  cancelled: 'danger',
  open: 'success',
  closed: 'neutral',
  awarded: 'primary',
  active: 'success',
  upcoming_period: 'info',
};

const STATUS_KEY: Record<string, TranslationKey> = {
  scheduled: 'badge.status.scheduled',
  upcoming: 'badge.status.upcoming',
  ongoing: 'badge.status.ongoing',
  completed: 'badge.status.completed',
  postponed: 'badge.status.postponed',
  cancelled: 'badge.status.cancelled',
  open: 'badge.status.open',
  closed: 'badge.status.closed',
  awarded: 'badge.status.awarded',
  active: 'badge.status.active',
  upcoming_period: 'badge.status.upcomingPeriod',
};

export function StatusBadge({ status, className }: { status: string | null | undefined; className?: string }) {
  const { t } = useLanguage();
  if (!status) return null;
  const key = STATUS_KEY[status];
  const label = key ? t(key) : humanizeEnum(status);
  return (
    <Badge tone={STATUS_TONE[status] ?? 'neutral'} className={className}>
      {label}
    </Badge>
  );
}
