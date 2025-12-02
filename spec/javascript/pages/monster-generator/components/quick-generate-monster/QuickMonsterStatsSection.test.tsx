import React from 'react';
import { render, screen } from '../../../../test-utils';
import QuickMonsterStatsSection from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/QuickMonsterStatsSection';

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/MonsterTypeSelect', () => {
  return function MockMonsterTypeSelect() {
    return <div data-testid="monster-type-select">Monster Type</div>;
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormField', () => {
  return function MockFormField({ label, name }: any) {
    return (
      <div data-testid={`form-field-${name}`}>
        <label>{label}</label>
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label, name }: any) {
    return (
      <div data-testid={`form-select-${name}`}>
        <label>{label}</label>
      </div>
    );
  };
});

describe('QuickMonsterStatsSection', () => {
  const mockUseForm = {
    register: jest.fn(),
    control: {},
    formState: { errors: {} },
  };

  const defaultProps = {
    archetypeOptions: [
      { label: 'Warrior', value: 'warrior' },
      { label: 'Spellcaster', value: 'spellcaster' },
    ],
    challengeRatingOptions: [
      { label: '1', value: '1' },
      { label: '5', value: '5' },
    ],
    UseForm: mockUseForm as any,
  };

  it('renders without crashing', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
  });

  it('renders Challenge Rating select', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Target Challenge Rating')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-challengeRatingOption')).toBeInTheDocument();
  });

  it('renders Armor Class field', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Armor Class')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-armorClass')).toBeInTheDocument();
  });

  it('renders Archetype select', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Archetype')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-archetypeOption')).toBeInTheDocument();
  });

  it('renders Monster Type select', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByTestId('monster-type-select')).toBeInTheDocument();
  });

  it('renders Alignment select', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Alignment')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-alignmentOption')).toBeInTheDocument();
  });

  it('renders Number of Attacks field', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Number of Attacks')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-numberOfAttacks')).toBeInTheDocument();
  });

  it('renders Size select', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Size')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-size')).toBeInTheDocument();
  });

  it('renders Race select', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Race (optional)')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-characterRace')).toBeInTheDocument();
  });

  it('renders all ability score fields', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('STR (optional)')).toBeInTheDocument();
    expect(screen.getByText('DEX (optional)')).toBeInTheDocument();
    expect(screen.getByText('CON (optional)')).toBeInTheDocument();
    expect(screen.getByText('INT (optional)')).toBeInTheDocument();
    expect(screen.getByText('WIS (optional)')).toBeInTheDocument();
    expect(screen.getByText('CHA (optional)')).toBeInTheDocument();
  });

  it('renders hit dice fields', () => {
    render(<QuickMonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Hit Dice Count')).toBeInTheDocument();
    expect(screen.getByText('Hit Dice Value')).toBeInTheDocument();
    expect(screen.getByText('Hit Points')).toBeInTheDocument();
    expect(screen.getByText('XP')).toBeInTheDocument();
  });
});
