import React from 'react';
import { render, screen } from '../../../test-utils';
import MonsterTypeSelect from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/MonsterTypeSelect';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label, name, options }: { label: string; name: string; options: unknown[] }) {
    return (
      <div data-testid={`form-select-${name}`}>
        <label>{label}</label>
        <select data-testid="select-element">
          {(options as { value: string; label: string }[]).map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
    );
  };
});

describe('MonsterTypeSelect', () => {
  const mockControl = {} as any;

  it('renders without crashing', () => {
    render(<MonsterTypeSelect control={mockControl} />);
    expect(screen.getByTestId('form-select-monsterTypeOption')).toBeInTheDocument();
  });

  it('renders with Type label', () => {
    render(<MonsterTypeSelect control={mockControl} />);
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders monster type options', () => {
    render(<MonsterTypeSelect control={mockControl} />);
    const select = screen.getByTestId('select-element');
    expect(select).toBeInTheDocument();
    // The select should contain monster type options
    expect(select.querySelectorAll('option').length).toBeGreaterThan(0);
  });
});
