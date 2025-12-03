import React from 'react';
import { render, screen, fireEvent } from '../../../../test-utils';
import AbilityScoreField from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/AbilityScoreField';

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/sounds/DiceRoll.mp3', () => 'dice-sound.mp3');

jest.mock('rpg-dice-roller', () => ({
  DiceRoll: jest.fn().mockImplementation(() => ({
    total: 15,
  })),
}));

jest.mock('use-sound', () => {
  return jest.fn(() => [jest.fn(), {}]);
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormField', () => {
  return function MockFormField({ label, name, hideLabel }: any) {
    return (
      <div data-testid={`form-field-${name}`}>
        {!hideLabel && <label>{label}</label>}
      </div>
    );
  };
});

jest.mock('../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

describe('AbilityScoreField', () => {
  const mockRegister = jest.fn();
  const mockSetValue = jest.fn();

  const defaultProps = {
    name: 'strength' as any,
    errors: {},
    label: 'STR',
    setValue: mockSetValue,
    register: mockRegister,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AbilityScoreField {...defaultProps} />);
  });

  it('renders roll buttons when hideRoll is false', () => {
    render(<AbilityScoreField {...defaultProps} />);
    expect(screen.getByText('STR 3d6')).toBeInTheDocument();
    expect(screen.getByText('4d6')).toBeInTheDocument();
  });

  it('renders label when hideRoll is true', () => {
    render(<AbilityScoreField {...defaultProps} hideRoll={true} />);
    expect(screen.getByText('STR')).toBeInTheDocument();
    expect(screen.queryByText('STR 3d6')).not.toBeInTheDocument();
  });

  it('renders ability score input field', () => {
    render(<AbilityScoreField {...defaultProps} />);
    expect(screen.getByTestId('form-field-strength')).toBeInTheDocument();
  });

  it('renders modifier field', () => {
    render(<AbilityScoreField {...defaultProps} />);
    expect(screen.getByTestId('form-field-strengthMod')).toBeInTheDocument();
  });

  it('calls setValue with 3d6 roll when 3d6 button clicked', () => {
    render(<AbilityScoreField {...defaultProps} />);
    const button = screen.getByText('STR 3d6');
    fireEvent.click(button);
    expect(mockSetValue).toHaveBeenCalledWith('strength', 15, {
      shouldDirty: true,
      shouldTouch: true,
    });
  });

  it('calls setValue with 4d6 roll when 4d6 button clicked', () => {
    render(<AbilityScoreField {...defaultProps} />);
    const button = screen.getByText('4d6');
    fireEvent.click(button);
    expect(mockSetValue).toHaveBeenCalledWith('strength', 15, {
      shouldDirty: true,
      shouldTouch: true,
    });
  });

  it('uses correct name for different ability scores', () => {
    render(<AbilityScoreField {...defaultProps} name="dexterity" label="DEX" />);
    expect(screen.getByTestId('form-field-dexterity')).toBeInTheDocument();
    expect(screen.getByTestId('form-field-dexterityMod')).toBeInTheDocument();
  });
});
