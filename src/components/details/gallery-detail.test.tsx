import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/providers/language-provider';
import { GalleryDetailView } from './gallery-detail';
import type { GalleryDetail } from '@/lib/types/content';

function LanguageToggle() {
  const { toggleLanguage } = useLanguage();
  return (
    <button type="button" onClick={toggleLanguage}>
      toggle
    </button>
  );
}

function withLang(ui: ReactNode) {
  return render(
    <LanguageProvider>
      <LanguageToggle />
      {ui}
    </LanguageProvider>,
  );
}

// title_en/title_hi are CMS-owned and already covered by bilingual.test.ts's
// pickText() tests - this fixture only needs to exercise the empty-gallery branch,
// so the title content itself is irrelevant to what this test checks.
const emptyGallery: GalleryDetail = {
  id: 'g1',
  slug: 'empty-gallery',
  title_en: 'Field Visit',
  title_hi: null,
  description_en: null,
  description_hi: null,
  cover_media: null,
  image_count: 0,
  images: [],
  display_order: null,
  public_url: '/galleries/empty-gallery',
};

describe('GalleryDetailView (empty gallery)', () => {
  it('shows the dictionary-owned empty-state message, switching on language toggle', () => {
    withLang(<GalleryDetailView gallery={emptyGallery} />);

    expect(screen.getByText('No photos in this gallery yet.')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));

    expect(screen.getByText('इस गैलरी में अभी तक कोई फ़ोटो नहीं है।')).toBeInTheDocument();
  });
});
