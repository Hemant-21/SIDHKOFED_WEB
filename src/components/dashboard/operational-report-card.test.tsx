import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/providers/language-provider';
import { OperationalReportCard } from './operational-report-card';
import type { PublicOperationalReport } from '@/lib/types/content';

function withLang(ui: ReactNode) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

const trainingReport: PublicOperationalReport = {
  report_key: 'training_attendance',
  title_en: 'Training Attendance',
  title_hi: 'प्रशिक्षण उपस्थिति',
  resolved_period: {
    mode: 'current_financial_year',
    start: '2026-04-01T00:00:00.000Z',
    end: '2027-03-31T00:00:00.000Z',
  },
  measures: [
    {
      measure_key: 'total_participants',
      label_en: 'Total Participants',
      label_hi: 'कुल प्रतिभागी',
      unit: 'people',
      value: 1280,
      note_en: 'Includes all completed training sessions this financial year.',
      note_hi: 'इस वित्तीय वर्ष के सभी पूर्ण प्रशिक्षण सत्र शामिल हैं।',
      completeness: { known: 40, missing: 2, undated: 0 },
    },
  ],
};

const emptyReport: PublicOperationalReport = {
  ...trainingReport,
  report_key: 'district_activity_coverage',
  measures: [],
};

describe('OperationalReportCard', () => {
  it('renders nothing when the report has no public-eligible measures', () => {
    const { container } = withLang(<OperationalReportCard report={emptyReport} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders the bilingual title in English by default', () => {
    withLang(<OperationalReportCard report={trainingReport} />);
    expect(screen.getByText('Training Attendance')).toBeInTheDocument();
    expect(screen.queryByText('प्रशिक्षण उपस्थिति')).not.toBeInTheDocument();
  });

  it('switches the title to Hindi when the language provider is hydrated from a stored Hindi preference', () => {
    window.localStorage.setItem('sidhkofed.lang', 'hi');
    withLang(<OperationalReportCard report={trainingReport} />);
    expect(screen.getByText('प्रशिक्षण उपस्थिति')).toBeInTheDocument();
    window.localStorage.removeItem('sidhkofed.lang');
  });

  it('renders the formatted measure value and unit', () => {
    withLang(<OperationalReportCard report={trainingReport} />);
    expect(screen.getByText('1,280')).toBeInTheDocument();
    expect(screen.getByText('people')).toBeInTheDocument();
  });

  it('renders the measure label and note', () => {
    withLang(<OperationalReportCard report={trainingReport} />);
    expect(screen.getByText('Total Participants')).toBeInTheDocument();
    expect(
      screen.getByText('Includes all completed training sessions this financial year.'),
    ).toBeInTheDocument();
  });

  it('renders a dash for a null measure value', () => {
    const nullValueReport: PublicOperationalReport = {
      ...trainingReport,
      measures: [{ ...trainingReport.measures[0]!, value: null }],
    };
    withLang(<OperationalReportCard report={nullValueReport} />);
    expect(screen.getByText('—')).toBeInTheDocument();
  });

  it('omits the "View details" link when linkHref is not provided', () => {
    withLang(<OperationalReportCard report={trainingReport} />);
    expect(screen.queryByRole('link')).not.toBeInTheDocument();
  });

  it('renders a "View details" link when linkHref is provided', () => {
    withLang(<OperationalReportCard report={trainingReport} linkHref="/impact/dashboard/training_attendance" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/impact/dashboard/training_attendance');
  });
});
