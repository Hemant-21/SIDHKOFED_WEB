import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { LanguageProvider } from '@/providers/language-provider';
import { HighlightBadge, StatusBadge } from './badge';

function renderWithLanguage(ui: React.ReactElement) {
  return render(<LanguageProvider>{ui}</LanguageProvider>);
}

describe('HighlightBadge', () => {
  it('renders a translated label and nothing for null', () => {
    const { container, rerender } = renderWithLanguage(<HighlightBadge type="important" />);
    expect(screen.getByText('Important')).toBeInTheDocument();
    rerender(
      <LanguageProvider>
        <HighlightBadge type={null} />
      </LanguageProvider>,
    );
    expect(container).toBeEmptyDOMElement();
  });
});

describe('StatusBadge', () => {
  it('renders status text (never colour-only) for accessibility', () => {
    renderWithLanguage(<StatusBadge status="completed" />);
    expect(screen.getByText('Completed')).toBeInTheDocument();
  });
});
