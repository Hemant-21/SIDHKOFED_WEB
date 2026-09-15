import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MultiSelect } from './multi-select';

const props = {
  id: 'type', label: 'Type', placeholder: 'All', applyLabel: 'Apply', clearLabel: 'Clear selection',
  options: [{ value: 'workshop', label: 'Workshop' }, { value: 'awareness-programme', label: 'Awareness Programme' }],
};

describe('MultiSelect', () => {
  it('keeps checkbox changes local until Apply and restores the trigger focus', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect {...props} value={['workshop']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Type' }));
    expect(screen.getByRole('checkbox', { name: 'Workshop' })).toBeChecked();
    await user.click(screen.getByRole('checkbox', { name: 'Awareness Programme' }));
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onChange).toHaveBeenCalledWith(['workshop', 'awareness-programme']);
    expect(screen.getByRole('button', { name: 'Type' })).toHaveFocus();
  });

  it('cancels on Escape and allows clearing all applied selections', async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<MultiSelect {...props} value={['workshop']} onChange={onChange} />);
    await user.click(screen.getByRole('button', { name: 'Type' }));
    await user.click(screen.getByRole('checkbox', { name: 'Awareness Programme' }));
    await user.keyboard('{Escape}');
    expect(onChange).not.toHaveBeenCalled();
    await user.click(screen.getByRole('button', { name: 'Type' }));
    expect(screen.getByRole('checkbox', { name: 'Awareness Programme' })).not.toBeChecked();
    await user.click(screen.getByRole('button', { name: 'Clear selection' }));
    await user.click(screen.getByRole('button', { name: 'Apply' }));
    expect(onChange).toHaveBeenCalledWith([]);
  });
});
