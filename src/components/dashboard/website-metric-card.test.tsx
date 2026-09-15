import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/providers/language-provider';
import { WebsiteMetricGrid } from './website-metric-card';
import type { PublicWebsiteMetric } from '@/lib/types/content';

function withLang(ui: ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

const districtsMetric: PublicWebsiteMetric = {
  metric_key: 'districts_covered',
  label_en: 'Districts Covered',
  label_hi: 'कवर किए गए जिले',
  value: 24,
  unit: 'districts',
  period: { mode: 'as_of', start: null, end: null },
  as_of_date: '2026-08-01T00:00:00.000Z',
  disclosure_note_en: 'Figures reflect the most recent administrative count.',
  disclosure_note_hi: 'आंकड़े नवीनतम प्रशासनिक गणना को दर्शाते हैं।',
};

describe('WebsiteMetricGrid', () => {
  it('renders nothing for an empty metrics array', () => {
    const { container } = withLang(<WebsiteMetricGrid metrics={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the bilingual label in English by default', () => {
    withLang(<WebsiteMetricGrid metrics={[districtsMetric]} />);
    expect(screen.getByText('Districts Covered')).toBeInTheDocument();
    expect(screen.queryByText('कवर किए गए जिले')).not.toBeInTheDocument();
  });

  it('switches the label to Hindi when the language provider is hydrated from a stored Hindi preference', () => {
    window.localStorage.setItem('sidhkofed.lang', 'hi');
    withLang(<WebsiteMetricGrid metrics={[districtsMetric]} />);
    expect(screen.getByText('कवर किए गए जिले')).toBeInTheDocument();
    expect(screen.queryByText('Districts Covered')).not.toBeInTheDocument();
    window.localStorage.removeItem('sidhkofed.lang');
  });

  it('renders the formatted value and unit', () => {
    withLang(<WebsiteMetricGrid metrics={[districtsMetric]} />);
    expect(screen.getByText('24')).toBeInTheDocument();
    expect(screen.getByText('districts')).toBeInTheDocument();
  });

  it('renders the as_of_date in the caption', () => {
    withLang(<WebsiteMetricGrid metrics={[districtsMetric]} />);
    expect(screen.getByText((text) => text.includes('As of'))).toBeInTheDocument();
  });

  it('omits the as-of caption when as_of_date is null', () => {
    const noDate: PublicWebsiteMetric = { ...districtsMetric, as_of_date: null };
    withLang(<WebsiteMetricGrid metrics={[noDate]} />);
    expect(screen.queryByText((text) => text.includes('As of'))).not.toBeInTheDocument();
  });

  it('renders the disclosure note', () => {
    withLang(<WebsiteMetricGrid metrics={[districtsMetric]} />);
    expect(screen.getByText('Figures reflect the most recent administrative count.')).toBeInTheDocument();
  });

  it('renders a "band" variant without a bordered card wrapper', () => {
    const { container } = withLang(<WebsiteMetricGrid metrics={[districtsMetric]} variant="band" />);
    expect(container.querySelector('li')).not.toBeInTheDocument();
    expect(screen.getByText('Districts Covered')).toBeInTheDocument();
  });
});
