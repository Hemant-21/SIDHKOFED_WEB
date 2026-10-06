import { Badge } from '@/components/ui/badge';

/**
 * Renders CMS text that fell back to English because no Hindi value was published.
 * Marks the language switch explicitly (`lang="en"` for assistive tech + a small "EN"
 * badge) instead of silently mixing languages inside Hindi-mode pages.
 */
export function BilingualFallbackText({
  text,
  isFallback,
  as: As = 'span',
  className,
}: {
  text: string;
  isFallback: boolean;
  as?: 'span' | 'div';
  className?: string;
}) {
  if (!isFallback) return <>{text}</>;
  return (
    <As className={className}>
      <span lang="en">{text}</span>{' '}
      <Badge tone="neutral" className="align-middle">
        EN
      </Badge>
    </As>
  );
}
