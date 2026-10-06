import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/providers/language-provider';
import { MembershipUnderstandingSection } from './membership-content';

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

describe('MembershipUnderstandingSection', () => {
  it('renders English copy by default and switches to Hindi on language toggle', () => {
    withLang(<MembershipUnderstandingSection />);

    expect(screen.getByText('Understanding Membership')).toBeInTheDocument();
    expect(screen.getByText('Shareholder')).toBeInTheDocument();
    expect(screen.getByText('Non-Shareholder')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));

    expect(screen.getByText('सदस्यता को समझना')).toBeInTheDocument();
    expect(screen.getByText('शेयरधारक')).toBeInTheDocument();
    expect(screen.getByText('गैर-शेयरधारक')).toBeInTheDocument();
    expect(screen.queryByText('Shareholder')).not.toBeInTheDocument();
  });
});
