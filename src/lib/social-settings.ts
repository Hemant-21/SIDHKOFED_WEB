import 'server-only';

/**
 * Server-side fetch for the public social-settings group (Settings → Social in the CMS,
 * exposed at `GET /public/settings/social`). Never throws - returns `null` on any failure
 * so the footer degrades to "no social icons" rather than breaking (the same fail-safe
 * pattern as `getContactSettings`).
 */

import { getOneSafe } from './api/server';
import { publicSettingsPath } from './api/endpoints';
import type { PublicSocialSettings } from './types/settings';

/** Cache window for the social settings fetch - matches the backend's Settings Redis TTL. */
const SOCIAL_SETTINGS_REVALIDATE = 300;

export async function getSocialSettings(): Promise<PublicSocialSettings | null> {
  return getOneSafe<PublicSocialSettings>(publicSettingsPath('social'), {
    revalidate: SOCIAL_SETTINGS_REVALIDATE,
  });
}
