import React from 'react';
import { render, screen } from '@testing-library/react';
import AbilitiesSection from '../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/AbilitiesSection';

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/AbilityScoreField', () => {
  return function MockAbilityScoreField({ label, name }: any) {
    return (
      <div data-testid={`ability-field-${name}`}>
        {label}
      </div>
    );
  };
});

describe('AbilitiesSection', () => {
  const mockUseForm = {
    formState: { errors: {} },
    register: jest.fn(),
    setValue: jest.fn(),
  };

  it('renders without crashing', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
  });

  it('renders all six ability score fields', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByTestId('ability-field-strength')).toBeInTheDocument();
    expect(screen.getByTestId('ability-field-dexterity')).toBeInTheDocument();
    expect(screen.getByTestId('ability-field-constitution')).toBeInTheDocument();
    expect(screen.getByTestId('ability-field-intelligence')).toBeInTheDocument();
    expect(screen.getByTestId('ability-field-wisdom')).toBeInTheDocument();
    expect(screen.getByTestId('ability-field-charisma')).toBeInTheDocument();
  });

  it('renders STR field with correct label', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('STR')).toBeInTheDocument();
  });

  it('renders DEX field with correct label', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('DEX')).toBeInTheDocument();
  });

  it('renders CON field with correct label', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('CON')).toBeInTheDocument();
  });

  it('renders INT field with correct label', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('INT')).toBeInTheDocument();
  });

  it('renders WIS field with correct label', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('WIS')).toBeInTheDocument();
  });

  it('renders CHA field with correct label', () => {
    render(<AbilitiesSection UseForm={mockUseForm as any} />);
    expect(screen.getByText('CHA')).toBeInTheDocument();
  });
});
