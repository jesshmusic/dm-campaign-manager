import React from 'react';
import { render, screen } from '@testing-library/react';
import MonsterTypeSelect from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/MonsterTypeSelect';

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label }: any) {
    return <div data-testid="form-select">{label}</div>;
  };
});

describe('MonsterTypeSelect', () => {
  const mockControl = {} as any;

  it('renders without crashing', () => {
    render(<MonsterTypeSelect control={mockControl} />);
  });

  it('renders FormSelect with Type label', () => {
    render(<MonsterTypeSelect control={mockControl} />);
    expect(screen.getByText('Type')).toBeInTheDocument();
  });

  it('renders FormSelect component', () => {
    render(<MonsterTypeSelect control={mockControl} />);
    expect(screen.getByTestId('form-select')).toBeInTheDocument();
  });
});
