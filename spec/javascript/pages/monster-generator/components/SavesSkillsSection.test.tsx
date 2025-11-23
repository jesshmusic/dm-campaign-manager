import React from 'react';
import { render, screen } from '@testing-library/react';
import SavesSkillsSection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/SavesSkillsSection';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelectAsync', () => {
  return function MockFormSelectAsync({ label, name }: any) {
    return (
      <div data-testid={`form-select-async-${name}`}>
        <label>{label}</label>
      </div>
    );
  };
});

describe('SavesSkillsSection', () => {
  const mockUseForm = {
    control: {},
  };

  it('renders without crashing', () => {
    render(<SavesSkillsSection UseForm={mockUseForm as any} />);
  });

  it('renders Saving Throws select', () => {
    render(<SavesSkillsSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('Saving Throws')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-async-savingThrowOptions')).toBeInTheDocument();
  });

  it('renders Skills select', () => {
    render(<SavesSkillsSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('Skills')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-async-skillOptions')).toBeInTheDocument();
  });
});
