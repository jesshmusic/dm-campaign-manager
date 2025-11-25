import React from 'react';
import { render, screen } from '@testing-library/react';
import DiceFields from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/DiceFields';

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

describe('DiceFields', () => {
  const mockRegister = jest.fn();
  const defaultProps = {
    countName: 'hitDiceNumber' as any,
    dieName: 'hitDiceValue' as any,
    className: 'test-class',
    errors: {},
    register: mockRegister as any,
  };

  it('renders without crashing', () => {
    render(<DiceFields {...defaultProps} />);
  });

  it('renders count field', () => {
    render(<DiceFields {...defaultProps} />);
    expect(screen.getByTestId('form-field-hitDiceNumber')).toBeInTheDocument();
    expect(screen.getByText('Count')).toBeInTheDocument();
  });

  it('renders dice field', () => {
    render(<DiceFields {...defaultProps} />);
    expect(screen.getByTestId('form-select-hitDiceValue')).toBeInTheDocument();
    expect(screen.getByText('Dice')).toBeInTheDocument();
  });

  it('uses correct field names', () => {
    render(<DiceFields {...defaultProps} countName="attackDiceNumber" dieName="attackDiceValue" />);
    expect(screen.getByTestId('form-field-attackDiceNumber')).toBeInTheDocument();
    expect(screen.getByTestId('form-select-attackDiceValue')).toBeInTheDocument();
  });
});
