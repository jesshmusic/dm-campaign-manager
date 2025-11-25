import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ActionsForm from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/ActionsForm';
import { ActionTypes } from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/types';

jest.mock('react-icons/gi', () => ({
  GiAbacus: () => <div>AbacusIcon</div>,
  GiSwordsPower: () => <div>SwordIcon</div>,
}));

jest.mock('react-icons/all', () => ({
  GiMagicPalm: () => <div>MagicIcon</div>,
}));

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm', () => {
  return function MockActionForm({ actionIndex, remove }: any) {
    return (
      <div data-testid={`action-form-${actionIndex}`}>
        <button onClick={() => remove(actionIndex)}>Remove {actionIndex}</button>
      </div>
    );
  };
});

describe('ActionsForm', () => {
  const mockAppendAction = jest.fn();
  const mockHandleRemove = jest.fn();

  const defaultProps = {
    appendAction: mockAppendAction,
    fieldName: 'actions' as any,
    fields: [],
    handleRemove: mockHandleRemove,
    singularTitle: 'Action',
    useForm: {
      control: {} as any,
      formState: { errors: {} },
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<ActionsForm {...defaultProps} />);
  });

  it('renders Add Action button', () => {
    render(<ActionsForm {...defaultProps} />);
    expect(screen.getByText('Add Action')).toBeInTheDocument();
  });

  it('renders Add Attack button', () => {
    render(<ActionsForm {...defaultProps} />);
    expect(screen.getByText('Add Attack')).toBeInTheDocument();
  });

  it('renders Add Spellcasting button initially', () => {
    render(<ActionsForm {...defaultProps} />);
    expect(screen.getByText('Add Spellcasting')).toBeInTheDocument();
  });

  it('calls appendAction with ability action type when Add Action clicked', () => {
    render(<ActionsForm {...defaultProps} />);
    const button = screen.getByText('Add Action');
    fireEvent.click(button);
    expect(mockAppendAction).toHaveBeenCalledWith({
      desc: '',
      actionType: ActionTypes.ability,
    });
  });

  it('calls appendAction with attack action type and defaults when Add Attack clicked', () => {
    render(<ActionsForm {...defaultProps} />);
    const button = screen.getByText('Add Attack');
    fireEvent.click(button);
    expect(mockAppendAction).toHaveBeenCalledWith({
      actionType: ActionTypes.attack,
      numAttacks: 1,
      desc: '',
      damage: {
        damageTypeOption: { label: 'Slashing', value: 'slashing' },
        damageType: 'slashing',
        diceValueOption: { label: 'd6', value: 6 },
        diceValue: 6,
        isRanged: false,
        numDice: 1,
        numTargets: 1,
        rangeNormal: 120,
        rangeLong: 300,
        reach: 5,
      },
    });
  });

  it('calls appendAction with spellcasting action type when Add Spellcasting clicked', () => {
    render(<ActionsForm {...defaultProps} />);
    const button = screen.getByText('Add Spellcasting');
    fireEvent.click(button);
    expect(mockAppendAction).toHaveBeenCalledWith({
      name: 'Spellcasting',
      actionType: ActionTypes.spellCasting,
      desc: '',
      spellCasting: {
        level: 1,
        ability: 'Intelligence',
        abilityOption: undefined, // Default ability option is undefined until user selects one
        slots: {
          first: 0,
          second: 0,
          third: 0,
          fourth: 0,
          fifth: 0,
          sixth: 0,
          seventh: 0,
          eighth: 0,
          ninth: 0,
        },
        spellOptions: [],
      },
    });
  });

  it('hides Add Spellcasting button after spellcasting added', () => {
    render(<ActionsForm {...defaultProps} />);
    const button = screen.getByText('Add Spellcasting');
    fireEvent.click(button);
    expect(screen.queryByText('Add Spellcasting')).not.toBeInTheDocument();
  });

  it('renders ActionForm for each field', () => {
    const fields = [
      { id: '1', actionType: ActionTypes.ability },
      { id: '2', actionType: ActionTypes.attack },
    ] as any;
    render(<ActionsForm {...defaultProps} fields={fields} />);
    expect(screen.getByTestId('action-form-0')).toBeInTheDocument();
    expect(screen.getByTestId('action-form-1')).toBeInTheDocument();
  });

  it('calls handleRemove when action removed', () => {
    const fields = [{ id: '1', actionType: ActionTypes.ability }] as any;
    render(<ActionsForm {...defaultProps} fields={fields} />);
    const button = screen.getByText('Remove 0');
    fireEvent.click(button);
    expect(mockHandleRemove).toHaveBeenCalledWith(0);
  });

  it('shows Add Spellcasting button when spellcasting action removed', () => {
    const fields = [{ id: '1', actionType: ActionTypes.spellCasting }] as any;
    render(<ActionsForm {...defaultProps} fields={fields} />);

    // Initially hide the button by adding spellcasting
    const addButton = screen.getByText('Add Spellcasting');
    fireEvent.click(addButton);
    expect(screen.queryByText('Add Spellcasting')).not.toBeInTheDocument();

    // Remove the spellcasting action
    const removeButton = screen.getByText('Remove 0');
    fireEvent.click(removeButton);

    // Button should appear again
    expect(screen.getByText('Add Spellcasting')).toBeInTheDocument();
  });

  it('does not show Add Spellcasting button when non-spellcasting action removed', () => {
    render(<ActionsForm {...defaultProps} />);
    const addButton = screen.getByText('Add Spellcasting');
    fireEvent.click(addButton);
    expect(screen.queryByText('Add Spellcasting')).not.toBeInTheDocument();
  });

  it('uses singularTitle in Add button text', () => {
    render(<ActionsForm {...defaultProps} singularTitle="Legendary Action" />);
    expect(screen.getByText('Add Legendary Action')).toBeInTheDocument();
  });
});
