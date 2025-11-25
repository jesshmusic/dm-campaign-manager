import React from 'react';
import { render, screen } from '@testing-library/react';
import AbilityForm from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/AbilityForm';

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ControllerInput', () => ({
  ControlledInput: ({ label, fieldName, readOnly, isTextArea }: any) => (
    <div data-testid={`controlled-input-${fieldName}`}>
      <label>{label}</label>
      {readOnly && <span>readonly</span>}
      {isTextArea && <span>textarea</span>}
    </div>
  ),
  ControllerInput: ({ label }: any) => <div>{label}</div>,
}));

describe('AbilityForm', () => {
  const defaultProps = {
    fieldName: 'action',
    errors: {},
    control: {} as any,
    readOnly: false,
  };

  it('renders without crashing', () => {
    render(<AbilityForm {...defaultProps} />);
  });

  it('renders description input', () => {
    render(<AbilityForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-action.desc')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
  });

  it('renders textarea input', () => {
    render(<AbilityForm {...defaultProps} />);
    expect(screen.getByText('textarea')).toBeInTheDocument();
  });

  it('applies readOnly when prop is true', () => {
    render(<AbilityForm {...defaultProps} readOnly={true} />);
    expect(screen.getByText('readonly')).toBeInTheDocument();
  });

  it('does not apply readOnly when prop is false', () => {
    render(<AbilityForm {...defaultProps} readOnly={false} />);
    expect(screen.queryByText('readonly')).not.toBeInTheDocument();
  });

  it('uses correct field name', () => {
    render(<AbilityForm {...defaultProps} fieldName="specialAbility" />);
    expect(screen.getByTestId('controlled-input-specialAbility.desc')).toBeInTheDocument();
  });
});
