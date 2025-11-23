import React from 'react';
import { render, screen } from '@testing-library/react';
import MonsterStatsSection from '../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/MonsterStatsSection';

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/MonsterTypeSelect', () => {
  return function MockMonsterTypeSelect() {
    return <div data-testid="monster-type-select">Type</div>;
  };
});

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormField', () => {
  return function MockFormField({ label, name }: any) {
    return <div data-testid={`form-field-${name}`}>{label}</div>;
  };
});

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label, name }: any) {
    return <div data-testid={`form-select-${name}`}>{label}</div>;
  };
});

jest.mock('../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/ChallengeRatingField', () => {
  return function MockChallengeRatingField({ onCalculateCr }: any) {
    return <button onClick={onCalculateCr}>Calculate CR</button>;
  };
});

describe('MonsterStatsSection', () => {
  const mockHandleCalculateCR = jest.fn();
  const mockUseForm = {
    control: {},
    formState: { errors: {} },
    register: jest.fn(),
  };

  const defaultProps = {
    UseForm: mockUseForm as any,
    handleCalculateCR: mockHandleCalculateCR,
  };

  it('renders without crashing', () => {
    render(<MonsterStatsSection {...defaultProps} />);
  });

  it('renders MonsterTypeSelect', () => {
    render(<MonsterStatsSection {...defaultProps} />);
    expect(screen.getByTestId('monster-type-select')).toBeInTheDocument();
  });

  it('renders Subtype field', () => {
    render(<MonsterStatsSection {...defaultProps} />);
    expect(screen.getByTestId('form-field-monsterSubtype')).toBeInTheDocument();
  });

  it('renders Alignment select', () => {
    render(<MonsterStatsSection {...defaultProps} />);
    expect(screen.getByTestId('form-select-alignmentOption')).toBeInTheDocument();
  });

  it('renders Size select', () => {
    render(<MonsterStatsSection {...defaultProps} />);
    expect(screen.getByTestId('form-select-size')).toBeInTheDocument();
  });

  it('renders Languages select', () => {
    render(<MonsterStatsSection {...defaultProps} />);
    expect(screen.getByTestId('form-select-languages')).toBeInTheDocument();
  });

  it('renders ChallengeRatingField', () => {
    render(<MonsterStatsSection {...defaultProps} />);
    expect(screen.getByText('Calculate CR')).toBeInTheDocument();
  });
});
