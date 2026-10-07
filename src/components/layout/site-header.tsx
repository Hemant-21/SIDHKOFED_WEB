'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Search } from 'lucide-react';
import { useLanguage } from '@/providers/language-provider';
import { Container } from '@/components/ui/container';
import { PRIMARY_NAV } from '@/config/navigation';
import { DesktopNav } from './desktop-nav';
import { MobileNav } from './mobile-nav';
import { LanguageToggle, TextSizeControls } from './accessibility-controls';
import { ThemeToggle } from './theme-toggle';

export function SiteHeader() {
  const { t, language } = useLanguage();

  return (
    <header className="sticky top-0 z-[60] shadow-sm">
      {/* Utility bar - strong heading colour, distinct from the primary/link blue used below.
          In dark mode this becomes near-black (--background) with a border underneath, since
          the light-mode navy would otherwise sit too close to the page background. */}
      <div className="bg-heading text-heading-foreground dark:border-b dark:border-border dark:bg-background dark:text-foreground">
        <Container className="flex h-10 items-center justify-between gap-4">
          <span
            className="hidden min-w-0 truncate text-xs font-medium text-heading-foreground/85 sm:block dark:text-foreground/85"
            lang={language}
          >
            {t('site.fullName')}
          </span>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <TextSizeControls className="hidden text-heading-foreground md:flex dark:text-foreground" />
            <LanguageToggle />
            <ThemeToggle className="text-heading-foreground hover:bg-heading-foreground/10 hover:text-heading-foreground dark:text-foreground dark:hover:bg-foreground/10 dark:hover:text-foreground" />
          </div>
        </Container>
      </div>

      {/* Main bar */}
      <div className="border-b-[3px] border-accent bg-surface">
        <Container className="flex h-16 items-center justify-between gap-4 md:h-[72px]">
          {/* Brand - logo fills the full bar height (touches the border), never wraps or shrinks */}
          <Link href="/" className="flex h-full shrink-0 items-center gap-3" aria-label={t('site.name')}>
            <Image src="/logo-sidhkofed.png" alt="SIDHKOFED" width={256} height={256} quality={90} className="h-16 w-16 shrink-0 object-contain" priority />
            <span className="font-display text-xl font-semibold text-foreground" lang={language}>
              {t('site.name')}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-1">
            <DesktopNav items={PRIMARY_NAV} />
            <Link
              href="/search"
              aria-label={t('nav.search')}
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-foreground transition-colors hover:bg-muted"
            >
              <Search className="h-5 w-5" aria-hidden="true" />
            </Link>
            {/* Contact Us - outline, so terracotta/accent stays reserved for the page's one
                key action rather than appearing in the header on every page. */}
            <Link
              href="/contact"
              className="ml-3 hidden items-center rounded-sm border-[1.5px] border-link px-5 py-2.5 text-sm font-bold text-link transition-colors hover:bg-link/10 nav:inline-flex"
            >
              {t('nav.contactUs')}
            </Link>
            <MobileNav items={PRIMARY_NAV} />
          </div>
        </Container>
      </div>
    </header>
  );
}
