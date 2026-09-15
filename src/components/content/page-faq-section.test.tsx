import type { ReactElement } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/providers/language-provider';
import type { Faq } from '@/lib/types/content';

const { getListSafe } = vi.hoisted(() => ({ getListSafe: vi.fn() }));
vi.mock('@/lib/api/server', () => ({ getListSafe }));

import { PageFaqSection } from './page-faq-section';

function withLang(ui: ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

const faq = (i: number): Faq => ({
  id: `f-${i}`,
  slug: `demo-faq-${i}`,
  question_en: `Question ${i}?`,
  question_hi: null,
  answer_en: `Answer ${i}.`,
  answer_hi: null,
  highlight_type: null,
});

beforeEach(() => {
  getListSafe.mockReset();
});

describe('PageFaqSection', () => {
  it('renders nothing when no FAQs are assigned to the page', async () => {
    getListSafe.mockResolvedValue({ items: [], pagination: { page: 1, page_size: 100, total_items: 0, total_pages: 0 } });
    const section = await PageFaqSection({ pageKey: 'contact' });
    expect(section).toBeNull();
  });

  it('renders nothing on a fetch failure rather than an empty accordion', async () => {
    getListSafe.mockResolvedValue({ error: true, items: [], pagination: { page: 1, page_size: 0, total_items: 0, total_pages: 0 } });
    const section = await PageFaqSection({ pageKey: 'contact' });
    expect(section).toBeNull();
  });

  it('renders the assigned FAQs and a view-all link when present', async () => {
    getListSafe.mockResolvedValue({
      items: [faq(1), faq(2)],
      pagination: { page: 1, page_size: 100, total_items: 2, total_pages: 1 },
    });
    const section = await PageFaqSection({ pageKey: 'home', title: 'Common Questions' });
    withLang(section as ReactElement);
    expect(screen.getByText('Common Questions')).toBeInTheDocument();
    expect(screen.getByText('Question 1?')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /View all FAQs/i })).toHaveAttribute('href', '/faqs');
  });

  it('paginates through multiple pages when the backend reports more than one', async () => {
    getListSafe
      .mockResolvedValueOnce({ items: [faq(1)], pagination: { page: 1, page_size: 1, total_items: 2, total_pages: 2 } })
      .mockResolvedValueOnce({ items: [faq(2)], pagination: { page: 2, page_size: 1, total_items: 2, total_pages: 2 } });
    const section = await PageFaqSection({ pageKey: 'home' });
    withLang(section as ReactElement);
    expect(screen.getByText('Question 1?')).toBeInTheDocument();
    expect(screen.getByText('Question 2?')).toBeInTheDocument();
    expect(getListSafe).toHaveBeenCalledTimes(2);
  });
});
