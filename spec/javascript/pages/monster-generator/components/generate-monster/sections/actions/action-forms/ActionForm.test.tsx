import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionForm from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm';

let mockUseWatchValue = 'attack';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useWatch: () => mockUseWatchValue,
}));

jest.mock('gsap/gsap-core', () => ({
  gsap: {
    to: jest.fn(),
  },
}));

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ControllerInput', () => ({
  ControlledInput: ({ label, fieldName }: any) => (
    <div data-testid={`controlled-input-${fieldName}`}>{label}</div>
  ),
}));

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/AbilityForm', () => {
  return function MockAbilityForm({ readOnly }: any) {
    return <div data-testid="ability-form">Ability {readOnly && '(readonly)'}</div>;
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/AttackForm', () => {
  return function MockAttackForm() {
    return <div data-testid="attack-form">Attack Form</div>;
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/SpellcastingForm', () => {
  return function MockSpellcastingForm() {
    return <div data-testid="spellcasting-form">Spellcasting Form</div>;
  };
});

describe('ActionForm', () => {
  const mockRemove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseWatchValue = 'attack';
  });

  const defaultProps = {
    actionIndex: 1,
    control: {} as any,
    errors: {},
    fieldName: 'actions',
    remove: mockRemove,
  };

  it('renders without crashing', () => {
    render(<ActionForm {...defaultProps} />);
  });

  it('renders name input field', () => {
    render(<ActionForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.1.name')).toBeInTheDocument();
  });

  it('renders remove button when remove prop provided', () => {
    render(<ActionForm {...defaultProps} />);
    expect(screen.getByText('Remove Action')).toBeInTheDocument();
  });

  it('does not render remove button when remove prop not provided', () => {
    const { remove, ...propsWithoutRemove } = defaultProps;
    render(<ActionForm {...propsWithoutRemove} />);
    expect(screen.queryByText('Remove Action')).not.toBeInTheDocument();
  });

  it('calls remove with correct index when remove clicked', () => {
    render(<ActionForm {...defaultProps} />);
    const button = screen.getByText('Remove Action');
    fireEvent.click(button);
    expect(mockRemove).toHaveBeenCalledWith(1);
  });

  it('renders AbilityForm', () => {
    render(<ActionForm {...defaultProps} />);
    expect(screen.getByTestId('ability-form')).toBeInTheDocument();
  });

  it('renders AttackForm when actionType is attack', () => {
    mockUseWatchValue = 'attack';
    render(<ActionForm {...defaultProps} />);
    expect(screen.getByTestId('attack-form')).toBeInTheDocument();
  });

  it('does not render AttackForm when actionType is not attack', () => {
    mockUseWatchValue = 'ability';
    render(<ActionForm {...defaultProps} />);
    expect(screen.queryByTestId('attack-form')).not.toBeInTheDocument();
  });

  it('renders SpellcastingForm when actionType is spellCasting', () => {
    mockUseWatchValue = 'spellCasting';
    render(<ActionForm {...defaultProps} />);
    expect(screen.getByTestId('spellcasting-form')).toBeInTheDocument();
  });

  it('does not render SpellcastingForm when actionType is not spellCasting', () => {
    mockUseWatchValue = 'attack';
    render(<ActionForm {...defaultProps} />);
    expect(screen.queryByTestId('spellcasting-form')).not.toBeInTheDocument();
  });

  it('sets AbilityForm to readonly when actionType is not ability', () => {
    mockUseWatchValue = 'attack';
    render(<ActionForm {...defaultProps} />);
    expect(screen.getByText(/readonly/)).toBeInTheDocument();
  });

  it('uses correct field name prefix with actionIndex', () => {
    render(<ActionForm {...defaultProps} actionIndex={2} />);
    expect(screen.getByTestId('controlled-input-actions.2.name')).toBeInTheDocument();
  });

  it('uses correct field name prefix without actionIndex', () => {
    const { actionIndex, ...propsWithoutIndex } = defaultProps;
    render(<ActionForm {...propsWithoutIndex} />);
    expect(screen.getByTestId('controlled-input-actions.name')).toBeInTheDocument();
  });
});
