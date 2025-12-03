import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import NameOptions from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/NameOptions';

jest.mock('react-select', () => {
  return function MockSelect({ options, onChange, id }: any) {
    return (
      <select
        data-testid={id}
        onChange={(e) => {
          const option = options.find((opt: any) => opt.value === e.target.value);
          onChange(option);
        }}
      >
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick }: any) {
    return (
      <button data-testid="submit-button" onClick={onClick}>
        {title}
      </button>
    );
  };
});

jest.mock('react-icons/all', () => ({
  GiBattleGear: () => <span>Gear</span>,
}));

describe('NameOptions', () => {
  const mockOnFormSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);
  });

  it('displays gender select', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);
    expect(screen.getByTestId('nameGeneratorGender')).toBeInTheDocument();
  });

  it('displays race select', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);
    expect(screen.getByTestId('nameGeneratorRace')).toBeInTheDocument();
  });

  it('displays submit button with correct title', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Character" />);
    expect(screen.getByText('Get Character')).toBeInTheDocument();
  });

  it('calls onFormSubmit with default values when submit is clicked', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('female', 'human', undefined);
  });

  it('calls onFormSubmit with token when provided', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" token="test-token" />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('female', 'human', 'test-token');
  });

  it('updates gender selection', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);

    const genderSelect = screen.getByTestId('nameGeneratorGender');
    fireEvent.change(genderSelect, { target: { value: 'male' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('male', 'human', undefined);
  });

  it('updates race selection', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);

    const raceSelect = screen.getByTestId('nameGeneratorRace');
    fireEvent.change(raceSelect, { target: { value: 'elf' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('female', 'elf', undefined);
  });
});
