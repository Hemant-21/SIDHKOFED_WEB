import type { ReactNode } from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LanguageProvider, useLanguage } from '@/providers/language-provider';
import { ToolkitDisclosure } from './toolkit-info';
import type { ToolkitInfo } from '@/lib/types/reports';

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

// itemNameEn/itemNameHi are CMS-owned and already covered by bilingual.test.ts's
// pickText() tests - this fixture only needs one item so the table renders a status
// row; the item's own name is irrelevant to what this test checks.
const toolkit: ToolkitInfo = {
  applicable: true,
  items: [
    {
      toolkitItemId: 'item-1',
      toolkitId: 'toolkit-1',
      itemNameEn: 'Seed kit',
      itemNameHi: null,
      distributionPattern: 'individual',
      defaultGroupSize: null,
      defaultQuantityPerUnit: 1,
      unit: 'kg',
      status: 'distributed',
    },
  ],
};

// `title` stands in for a report row's own name (CMS/report-owned, not asserted on
// here) interpolated into the dictionary's `reports.toolkit.dialogHeading` template -
// only the dictionary-owned "Toolkit - " / "टूलकिट - " prefix is checked below.
describe('ToolkitDisclosure', () => {
  it('shows dictionary-owned button, dialog-heading prefix, and status text, switching on language toggle', () => {
    withLang(<ToolkitDisclosure title="Training Programme" toolkit={toolkit} />);

    fireEvent.click(screen.getByText('Toolkit'));
    expect(screen.getByText((text) => text.startsWith('Toolkit - '))).toBeInTheDocument();
    expect(screen.getByText('Distributed')).toBeInTheDocument();

    fireEvent.click(screen.getByText('toggle'));
    expect(screen.getByText((text) => text.startsWith('टूलकिट - '))).toBeInTheDocument();
    expect(screen.getByText('वितरित')).toBeInTheDocument();
  });
});
