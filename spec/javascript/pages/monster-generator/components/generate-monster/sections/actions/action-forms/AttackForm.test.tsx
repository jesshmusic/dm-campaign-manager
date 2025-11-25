import React from 'react';
import { render, screen } from '@testing-library/react';
import AttackForm from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/AttackForm';

const mockUseWatch = jest.fn().mockReturnValue(false);

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: () => mockUseWatch(),
}));

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ControllerInput', () => ({
  ControlledInput: ({ label, fieldName }: any) => (
    <div data-testid={`controlled-input-${fieldName}`}>{label}</div>
  ),
  ControlledSelect: ({ label, fieldName }: any) => (
    <div data-testid={`controlled-select-${fieldName}`}>{label}</div>
  ),
}));

describe('AttackForm', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWatch.mockReturnValue(false);
  });

  const defaultProps = {
    fieldName: 'actions.0',
    errors: {},
    control: {} as any,
  };

  it('renders without crashing', () => {
    render(<AttackForm {...defaultProps} />);
  });

  it('renders Number of Attacks field', () => {
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.numAttacks')).toBeInTheDocument();
    expect(screen.getByText('Number of Attacks')).toBeInTheDocument();
  });

  it('renders Dice Count field', () => {
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.damage.numDice')).toBeInTheDocument();
    expect(screen.getByText('Dice Count')).toBeInTheDocument();
  });

  it('renders Dice Type select', () => {
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-select-actions.0.damage.diceValueOption')).toBeInTheDocument();
    expect(screen.getByText('Dice Type')).toBeInTheDocument();
  });

  it('renders Damage Type select', () => {
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-select-actions.0.damage.damageTypeOption')).toBeInTheDocument();
    expect(screen.getByText('Damage Type')).toBeInTheDocument();
  });

  it('renders Number of Targets field', () => {
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.damage.numTargets')).toBeInTheDocument();
    expect(screen.getByText('Number of Targets')).toBeInTheDocument();
  });

  it('renders Ranged Attack checkbox', () => {
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.damage.isRanged')).toBeInTheDocument();
    expect(screen.getByText('Ranged Attack')).toBeInTheDocument();
  });

  it('renders Reach field when not ranged', () => {
    mockUseWatch.mockReturnValue(false);
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.damage.reach')).toBeInTheDocument();
    expect(screen.getByText('Reach')).toBeInTheDocument();
  });

  it('does not render Reach field when ranged', () => {
    mockUseWatch.mockReturnValue(true);
    render(<AttackForm {...defaultProps} />);
    expect(screen.queryByTestId('controlled-input-actions.0.damage.reach')).not.toBeInTheDocument();
  });

  it('renders range fields when ranged', () => {
    mockUseWatch.mockReturnValue(true);
    render(<AttackForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.damage.rangeNormal')).toBeInTheDocument();
    expect(screen.getByText('Normal Range')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.damage.rangeLong')).toBeInTheDocument();
    expect(screen.getByText('Long Range')).toBeInTheDocument();
  });

  it('does not render range fields when not ranged', () => {
    mockUseWatch.mockReturnValue(false);
    render(<AttackForm {...defaultProps} />);
    expect(screen.queryByTestId('controlled-input-actions.0.damage.rangeNormal')).not.toBeInTheDocument();
    expect(screen.queryByTestId('controlled-input-actions.0.damage.rangeLong')).not.toBeInTheDocument();
  });

  it('uses correct field name prefix', () => {
    render(<AttackForm {...defaultProps} fieldName="legendaryActions.2" />);
    expect(screen.getByTestId('controlled-input-legendaryActions.2.numAttacks')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-legendaryActions.2.damage.numDice')).toBeInTheDocument();
  });
});
