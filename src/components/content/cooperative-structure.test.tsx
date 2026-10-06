import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/providers/language-provider';
import { CooperativeStructure } from './cooperative-structure';

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

describe('CooperativeStructure', () => {
  it('renders English tier labels by default and switches to Hindi on language toggle', () => {
    withLang(<CooperativeStructure />);

    expect(screen.getByText('District Cooperative Unions')).toBeInTheDocument();
    expect(screen.getByText('Multipurpose Cooperative Societies (MPCS)')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));

    expect(screen.getByText('जिला सहकारी संघ')).toBeInTheDocument();
    expect(screen.getByText('बहुउद्देशीय सहकारी समितियाँ (एमपीसीएस)')).toBeInTheDocument();
    expect(screen.queryByText('District Cooperative Unions')).not.toBeInTheDocument();
  });
});
