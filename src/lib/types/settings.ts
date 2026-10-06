/**
 * Public settings - mirrors the curated subset the backend exposes via
 * `GET /public/settings/:group` (settings.public.controller.ts). Only the `contact` and
 * `social` groups are exposed today; each field mirrors a key in the backend's
 * `SETTINGS_CATALOG` (settings.catalog.ts) and is admin-editable via Settings → Contact /
 * Settings → Social in the CMS.
 */

export interface PublicContactSettings {
  'contact.office_name': string;
  'contact.address': string;
  'contact.phone': string;
  'contact.email': string;
  'contact.office_hours': string;
  'contact.map_url': string;
}

export interface PublicSocialSettings {
  'social.facebook_url': string;
  'social.twitter_url': string;
  'social.youtube_url': string;
  'social.instagram_url': string;
  'social.linkedin_url': string;
}
