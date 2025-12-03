import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import NameFormField from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/NameFormField';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick, color }: any) {
    return (
      <button onClick={onClick} data-color={color}>
        {title}
      </button>
    );
  };
});

describe('NameFormField', () => {
  const mockRegister = jest.fn((name, options) => ({
    name,
    ref: jest.fn(),
    onChange: jest.fn(),
    onBlur: jest.fn(),
  }));

  const defaultProps = {
    characterRace: 'human',
    handleGenerateName: jest.fn(),
    handleGenerateMonsterName: jest.fn(),
    register: mockRegister as any,
    errors: {},
    monsterType: 'Beast',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NameFormField {...defaultProps} />);
  });

  it('displays name label', () => {
    render(<NameFormField {...defaultProps} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders name input field', () => {
    render(<NameFormField {...defaultProps} />);
    const input = screen.getByPlaceholderText('Monster name');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
  });

  it('registers name field with validation', () => {
    render(<NameFormField {...defaultProps} />);
    expect(mockRegister).toHaveBeenCalledWith('name', { required: true });
  });

  it('displays error message when name has error', () => {
    const propsWithError = {
      ...defaultProps,
      errors: { name: { type: 'required' } },
    };
    render(<NameFormField {...propsWithError} />);
    expect(screen.getByText('This is required')).toBeInTheDocument();
  });

  it('does not display error message when no error', () => {
    render(<NameFormField {...defaultProps} />);
    expect(screen.queryByText('This is required')).not.toBeInTheDocument();
  });

  it('displays Random Monster Name button', () => {
    render(<NameFormField {...defaultProps} />);
    expect(screen.getByText('Random Monster Name')).toBeInTheDocument();
  });

  it('calls handleGenerateMonsterName when Random Monster Name clicked', () => {
    render(<NameFormField {...defaultProps} />);
    const button = screen.getByText('Random Monster Name');
    fireEvent.click(button);
    expect(defaultProps.handleGenerateMonsterName).toHaveBeenCalled();
  });

  it('displays NPC name buttons when monsterType is humanoid', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'Humanoid',
    };
    render(<NameFormField {...humanoidProps} />);

    expect(screen.getByText('Random NPC Name')).toBeInTheDocument();
    expect(screen.getByText('Random Male NPC Name')).toBeInTheDocument();
    expect(screen.getByText('Random Female NPC Name')).toBeInTheDocument();
  });

  it('does not display NPC name buttons when monsterType is not humanoid', () => {
    render(<NameFormField {...defaultProps} />);

    expect(screen.queryByText('Random NPC Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Random Male NPC Name')).not.toBeInTheDocument();
    expect(screen.queryByText('Random Female NPC Name')).not.toBeInTheDocument();
  });

  it('handles humanoid monsterType case-insensitively', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'hUmAnOiD',
    };
    render(<NameFormField {...humanoidProps} />);

    expect(screen.getByText('Random NPC Name')).toBeInTheDocument();
  });

  it('calls handleGenerateName with correct params for Random NPC Name', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'Humanoid',
      characterRace: 'elf',
    };
    render(<NameFormField {...humanoidProps} />);

    const button = screen.getByText('Random NPC Name');
    fireEvent.click(button);

    expect(defaultProps.handleGenerateName).toHaveBeenCalledWith('female', 'elf');
  });

  it('calls handleGenerateName with correct params for Random Male NPC Name', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'Humanoid',
      characterRace: 'dwarf',
    };
    render(<NameFormField {...humanoidProps} />);

    const button = screen.getByText('Random Male NPC Name');
    fireEvent.click(button);

    expect(defaultProps.handleGenerateName).toHaveBeenCalledWith('male', 'dwarf');
  });

  it('calls handleGenerateName with correct params for Random Female NPC Name', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'Humanoid',
      characterRace: 'halfling',
    };
    render(<NameFormField {...humanoidProps} />);

    const button = screen.getByText('Random Female NPC Name');
    fireEvent.click(button);

    expect(defaultProps.handleGenerateName).toHaveBeenCalledWith('female', 'halfling');
  });

  it('uses "any" for characterRace when not provided', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'Humanoid',
      characterRace: undefined,
    };
    render(<NameFormField {...humanoidProps} />);

    const button = screen.getByText('Random NPC Name');
    fireEvent.click(button);

    expect(defaultProps.handleGenerateName).toHaveBeenCalledWith('female', 'any');
  });

  it('uses "any" for characterRace in male name when not provided', () => {
    const humanoidProps = {
      ...defaultProps,
      monsterType: 'Humanoid',
      characterRace: undefined,
    };
    render(<NameFormField {...humanoidProps} />);

    const button = screen.getByText('Random Male NPC Name');
    fireEvent.click(button);

    expect(defaultProps.handleGenerateName).toHaveBeenCalledWith('male', 'any');
  });
});
