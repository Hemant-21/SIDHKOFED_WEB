'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Mail, Phone, Clock } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { pickText } from '@/utils/bilingual';
import { Container } from '@/components/ui/container';
import { FOOTER_NAV } from '@/config/navigation';
import type { PublicContactSettings } from '@/lib/types/settings';
import type { Language, TranslationKey } from '@/i18n/dictionary';

export function SiteFooter({ contactSettings }: { contactSettings: PublicContactSettings | null }) {
  const { t, language } = useLanguage();
  const year = new Date().getFullYear();
  // Build-time date - a reasonable stand-in for "last updated" until a CMS setting
  // exists for it; recomputed on every deploy.
  const lastUpdated = new Date().toLocaleDateString(language === 'hi' ? 'hi-IN' : 'en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  // Live values from Settings → Contact (getContactSettings(), fetched once in layout.tsx).
  // Each row hides individually when blank - no CMS-editable field pretends to have a value.
  // Note: unlike the previous hardcoded pair, Settings stores one string per key (no _en/_hi
  // split), so this shows in whatever single language the admin typed - not bilingual.
  const address = contactSettings?.['contact.address'].trim() ?? '';
  const phone = contactSettings?.['contact.phone'].trim() ?? '';
  const email = contactSettings?.['contact.email'].trim() ?? '';
  const hours = contactSettings?.['contact.office_hours'].trim() ?? '';

  return (
    <footer className="mt-16 border-t border-border bg-footer text-footer-foreground">
      <Container className="py-12">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">

          {/* Col 1 - Identity + contact */}
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white">
                <Image src="/logo-sidhkofed.png" alt="SIDHKOFED" width={40} height={40} className="shrink-0 rounded-full" />
              </span>
              <span className="text-lg font-bold" lang={language}>
                {t('site.name')}
              </span>
            </div>
            <ul className="mt-4 space-y-2 text-sm text-footer-foreground/85">
              {address !== '' ? (
                <li className="flex items-start gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="sr-only">{t('contact.address')}: </span>
                    {address}
                  </span>
                </li>
              ) : null}
              {phone !== '' ? (
                <li className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <a href={`tel:${phone.replace(/[^0-9+]/g, '')}`} className="hover:text-footer-foreground">
                    <span className="sr-only">{t('contact.phone')}: </span>
                    {phone}
                  </a>
                </li>
              ) : null}
              {email !== '' ? (
                <li className="flex items-center gap-2">
                  <Mail className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <a href={`mailto:${email}`} className="hover:text-footer-foreground">
                    <span className="sr-only">{t('contact.email')}: </span>
                    {email}
                  </a>
                </li>
              ) : null}
              {hours !== '' ? (
                <li className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0" aria-hidden="true" />
                  <span>
                    <span className="sr-only">{t('contact.hours')}: </span>
                    {hours}
                  </span>
                </li>
              ) : null}
            </ul>
          </div>

          {/* Col 2 - About */}
          <FooterLinkColumn headingKey="footer.aboutUs" items={FOOTER_NAV.about} language={language} t={t} />

          {/* Col 3 - Resources */}
          <FooterLinkColumn headingKey="footer.resources" items={FOOTER_NAV.resources} language={language} t={t} />

          {/* Col 4 - Important Links */}
          <FooterLinkColumn headingKey="footer.importantLinks" items={FOOTER_NAV.important} language={language} t={t} />

          {/* Col 5 - GIGW-mandated policy links */}
          <FooterLinkColumn headingKey="footer.policies" items={FOOTER_NAV.policies} language={language} t={t} />
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-footer-foreground/15 pt-6 text-sm text-footer-foreground/85 sm:flex-row sm:items-center">
          <div>
            <p>© {year} {t('footer.copyright')}</p>
            <p className="mt-1 text-xs text-footer-foreground/80">
              {t('footer.lastUpdated')} <span lang={language}>{lastUpdated}</span>
            </p>
          </div>
          <Link href="/search" className="hover:text-footer-foreground hover:underline">
            {t('nav.search')}
          </Link>
        </div>

        <p className="mt-4 text-center text-xs text-footer-foreground/70" lang={language}>
          {t('footer.designedDeveloped')}
        </p>
      </Container>
    </footer>
  );
}

function FooterLinkColumn({
  headingKey,
  items,
  language,
  t,
}: {
  headingKey: TranslationKey;
  items: { key: string; labelEn: string; labelHi: string; href: string; external?: boolean }[];
  language: Language;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div>
      <h2 className="text-sm font-semibold uppercase tracking-wide text-footer-foreground">
        {t(headingKey)}
      </h2>
      <ul className="mt-4 space-y-2 text-sm">
        {items.map((item) => (
          <li key={item.key}>
            {item.external ? (
              <a
                href={item.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-footer-foreground/85 hover:text-footer-foreground hover:underline"
              >
                {pickText(item.labelEn, item.labelHi, language)}
                <span className="sr-only"> {t('common.opensNewTab')}</span>
              </a>
            ) : (
              <Link
                href={item.href}
                className="text-footer-foreground/85 hover:text-footer-foreground hover:underline"
              >
                {pickText(item.labelEn, item.labelHi, language)}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
