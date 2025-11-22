import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AdventureHookOptions from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/AdventureHookOptions';

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick, disabled }: any) {
    return (
      <button data-testid="submit-button" onClick={onClick} disabled={disabled}>
        {title}
      </button>
    );
  };
});

jest.mock('react-icons/all', () => ({
  GiLevelTwoAdvanced: () => <span>Advanced</span>,
}));

describe('AdventureHookOptions', () => {
  const mockOnFormSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);
  });

  it('displays party size input', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);
    const input = screen.getByDisplayValue('5');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'partySize');
  });

  it('displays average level input', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);
    const input = screen.getByDisplayValue('1');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('name', 'averageLevel');
  });

  it('displays submit button', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);
    expect(screen.getByText('Get Hook')).toBeInTheDocument();
  });

  it('calls onFormSubmit with default values when submit is clicked', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith(5, 1);
  });

  it('updates party size when input changes', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);

    const partySizeInput = screen.getByDisplayValue('5');
    fireEvent.change(partySizeInput, { target: { value: '8' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith(8, 1);
  });

  it('updates average level when input changes', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} />);

    const averageLevelInput = screen.getByDisplayValue('1');
    fireEvent.change(averageLevelInput, { target: { value: '5' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith(5, 5);
  });

  it('disables inputs when isLoading is true', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} isLoading={true} />);

    const partySizeInput = screen.getByDisplayValue('5');
    const averageLevelInput = screen.getByDisplayValue('1');
    const submitButton = screen.getByTestId('submit-button');

    expect(partySizeInput).toBeDisabled();
    expect(averageLevelInput).toBeDisabled();
    expect(submitButton).toBeDisabled();
  });

  it('enables inputs when isLoading is false', () => {
    render(<AdventureHookOptions onFormSubmit={mockOnFormSubmit} isLoading={false} />);

    const partySizeInput = screen.getByDisplayValue('5');
    const averageLevelInput = screen.getByDisplayValue('1');
    const submitButton = screen.getByTestId('submit-button');

    expect(partySizeInput).not.toBeDisabled();
    expect(averageLevelInput).not.toBeDisabled();
    expect(submitButton).not.toBeDisabled();
  });
});
