import React from 'react';
import { render, screen, fireEvent } from '../../../../../../test-utils';
import SpeedForm from '../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/speeds/SpeedForm';

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

describe('SpeedForm', () => {
  const mockRemove = jest.fn();
  const defaultProps = {
    speedIndex: 0,
    control: {} as any,
    errors: {},
    fieldName: 'speeds',
    remove: mockRemove,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<SpeedForm {...defaultProps} />);
  });

  it('renders speed select', () => {
    render(<SpeedForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-select-speeds.0.nameOption')).toBeInTheDocument();
    expect(screen.getByText('Speed')).toBeInTheDocument();
  });

  it('renders value input', () => {
    render(<SpeedForm {...defaultProps} />);
    expect(screen.getByTestId('controlled-input-speeds.0.value')).toBeInTheDocument();
    expect(screen.getByText('Value')).toBeInTheDocument();
  });

  it('renders remove button', () => {
    render(<SpeedForm {...defaultProps} />);
    expect(screen.getByText('Remove Action')).toBeInTheDocument();
  });

  it('calls remove with correct index when remove button clicked', () => {
    render(<SpeedForm {...defaultProps} />);
    const button = screen.getByText('Remove Action');
    fireEvent.click(button);
    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('uses correct field names for different indices', () => {
    render(<SpeedForm {...defaultProps} speedIndex={2} />);
    expect(screen.getByTestId('controlled-select-speeds.2.nameOption')).toBeInTheDocument();
    expect(screen.getByTestId('controlled-input-speeds.2.value')).toBeInTheDocument();
  });

  it('calls remove with correct index for different indices', () => {
    render(<SpeedForm {...defaultProps} speedIndex={3} />);
    const button = screen.getByText('Remove Action');
    fireEvent.click(button);
    expect(mockRemove).toHaveBeenCalledWith(3);
  });
});
