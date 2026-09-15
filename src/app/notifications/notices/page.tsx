import { permanentRedirect } from 'next/navigation';
import { buildLegacyRedirectUrl, type SP } from '@/lib/legacy-redirects';

/**
 * Retired standalone listing — consolidated onto `/notifications?communication_type=
 * notice#listing`. Only the LIST view moves; `/notifications/notices/[slug]` detail pages are
 * untouched and keep their URLs (see `src/app/notifications/notices/[slug]/page.tsx`). See
 * `src/lib/legacy-redirects.ts` for the exact scope, passthrough and page-preservation rules.
 */
export default function NoticesPage({ searchParams }: { searchParams: SP }): never {
  permanentRedirect(buildLegacyRedirectUrl('notifications/notices', searchParams));
}
