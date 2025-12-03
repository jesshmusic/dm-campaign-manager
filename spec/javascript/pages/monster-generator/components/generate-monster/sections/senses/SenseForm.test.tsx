import React from 'react';
import { render, screen, fireEvent } from '../../../../../../test-utils';
import SenseForm from '../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/senses/SenseForm';

jest.mock('../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ControllerInput', () => ({
  ControlledInput: ({ label, fieldName }: any) => (
    <div data-testid={`controlled-input-${fieldName}`}>
      <label>{label}</label>
    </div>
  ),
  ControlledSelect: ({ label, fieldName }: any) => (
    <div data-testid={`controlled-select-${fieldName}`}>
      <label>{label}</label>
    </div>
  ),
}));

jest.mock('../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

describe('SenseForm', () => {
  const mockRemove = jest.fn();
  const defaultProps = {
    senseIndex: 0,
    control: {} as any,
    errors: {},
    fieldName: 'senses',
    remove: mockRemove,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SenseForm {...defaultProps} />);
  });

  it('renders sense select', () => {
    render(<SenseForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-select-senses.0.nameOption')).toBeInTheDocument();
    expect(screen.getByText('Sense')).toBeInTheDocument();
  });

  it('renders value input', () => {
    render(<SenseForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-senses.0.value')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders remove button', () => {
    render(<SenseForm {...defaultProps} />);
    expect(screen.getByText('Remove Action')).toBeInTheDocument();
  });

  it('calls remove with correct index when remove button clicked', () => {
    render(<SenseForm {...defaultProps} />);
    const button = screen.getByText('Remove Action');
    fireEvent.click(button);
    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('uses correct field names for different indices', () => {
    render(<SenseForm {...defaultProps} senseIndex={2} />);
    expect(screen.getByTestId('controlled-select-senses.2.nameOption')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-senses.2.value')).toBeInTheDocument();
  });

  it('calls remove with correct index for different indices', () => {
    render(<SenseForm {...defaultProps} senseIndex={3} />);
    const button = screen.getByText('Remove Action');
    fireEvent.click(button);
    expect(mockRemove).toHaveBeenCalledWith(3);
  });
});
