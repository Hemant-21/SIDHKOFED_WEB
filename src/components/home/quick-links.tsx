'use client';

import Link from 'next/link';
import { GraduationCap, Handshake, FileText, MonitorSmartphone } from 'lucide-react';
import { Container } from '@/components/ui/container';
import { useLanguage } from '@/providers/language-provider';
import type { TranslationKey } from '@/i18n/dictionary';

const ICON_CLASS = 'h-5 w-5 text-primary';

const LINKS: { icon: React.ReactNode; labelKey: TranslationKey; href: string }[] = [
  { icon: <GraduationCap className={ICON_CLASS} aria-hidden="true" />, labelKey: 'home.quickAccess.training', href: '/activities?event_category=trainings&event_type=training#listing' },
  { icon: <Handshake className={ICON_CLASS} aria-hidden="true" />, labelKey: 'home.quickAccess.buyerEnquiry', href: '/procurement/enquiry' },
  { icon: <FileText className={ICON_CLASS} aria-hidden="true" />, labelKey: 'home.quickAccess.forms', href: '/publications?knowledge_category=training-resources#listing' },
  { icon: <MonitorSmartphone className={ICON_CLASS} aria-hidden="true" />, labelKey: 'home.quickAccess.digitalServices', href: '/digital-services' },
];

export function QuickLinks() {
  const { t } = useLanguage();
  return (
    <section aria-label={t('home.quickAccess.title')}>
      <Container className="py-14">
        <div className="mb-6">
          <h2 className="font-display text-2xl font-bold text-heading">{t('home.quickAccess.title')}</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex items-center gap-3 rounded-md border border-border bg-surface p-4 transition-colors hover:border-link"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                {link.icon}
              </span>
              <p className="text-sm font-semibold text-heading group-hover:text-link">
                {t(link.labelKey)}
              </p>
            </Link>
          ))}
        </div>
      </Container>
    </section>
  );
}
