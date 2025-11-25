import React from 'react';
import { render, screen } from '@testing-library/react';
import SpellcastingForm from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/SpellcastingForm';

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  Controller: ({ render, name }: any) => {
    const mockField = { value: '', onChange: jest.fn(), ref: jest.fn() };
    return <div data-testid={`controller-${name}`}>{render({ field: mockField })}</div>;
  },
}));

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ControllerInput', () => ({
  __esModule: true,
  ControlledInput: ({ label, fieldName }: any) => (
    <div data-testid={`controlled-input-${fieldName}`}>{label}</div>
  ),
  ControllerInput: ({ label }: any) => <div data-testid="controller-input">{label}</div>,
}));

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelect', () => {
  return function MockFormSelect({ label, name }: any) {
    return <div data-testid={`form-select-${name}`}>{label}</div>;
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelectAsync', () => {
  return function MockFormSelectAsync({ label, name }: any) {
    return <div data-testid={`form-select-async-${name}`}>{label}</div>;
  };
});

describe('SpellcastingForm', () => {
  const defaultProps = {
    fieldName: 'actions.0',
    errors: {},
    control: {} as any,
  };

  it('renders without crashing', () => {
    render(<SpellcastingForm {...defaultProps} />);
  });

  it('renders Spellcasting heading', () => {
    render(<SpellcastingForm {...defaultProps} />);
    expect(screen.getByText('Spellcasting')).toBeInTheDocument();
  });

  it('renders Spellcasting Level field', () => {
    render(<SpellcastingForm {...defaultProps} />);
    expect(screen.getByTestId('controller-input')).toBeInTheDocument();
    expect(screen.getByText('Spellcasting Level')).toBeInTheDocument();
  });

  it('renders Spellcasting Ability select', () => {
    render(<SpellcastingForm {...defaultProps} />);
    expect(screen.getByTestId('form-select-actions.0.spellCasting.abilityOption')).toBeInTheDocument();
    expect(screen.getByText('Spellcasting Ability')).toBeInTheDocument();
  });

  it('renders all 9 spell slot inputs', () => {
    render(<SpellcastingForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.first')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.second')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.third')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.fourth')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.fifth')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.sixth')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.seventh')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.eighth')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-actions.0.spellCasting.slots.ninth')).toBeInTheDocument();
  });

  it('renders spell slot labels 1-9', () => {
    render(<SpellcastingForm {...defaultProps} />);
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('6')).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
    expect(screen.getByText('8')).toBeInTheDocument();
    expect(screen.getByText('9')).toBeInTheDocument();
  });

  it('renders spells search field', () => {
    render(<SpellcastingForm {...defaultProps} />);
    expect(
      screen.getByTestId('form-select-async-actions.0.spellCasting.spellOptions')
    ).toBeInTheDocument();
    expect(screen.getByText('Spells (search by name, level, or school)')).toBeInTheDocument();
  });

  it('uses correct field name prefix', () => {
    render(<SpellcastingForm {...defaultProps} fieldName="legendaryActions.2" />);
    expect(
      screen.getByTestId('controlled-input-legendaryActions.2.spellCasting.slots.first')
    ).toBeInTheDocument();
    expect(
      screen.getByTestId('form-select-legendaryActions.2.spellCasting.abilityOption')
    ).toBeInTheDocument();
  });
});
