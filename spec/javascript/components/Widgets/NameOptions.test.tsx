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

jest.mock('react-select/creatable', () => {
  return function MockCreatableSelect({ options, onChange, id }: any) {
    return (
      <select
        data-testid={id}
        onChange={(e) => {
          const option = options.find((opt: any) => opt.value === e.target.value);
          onChange(option);
        }}
      >
        <option value="">Select...</option>
        {options.map((opt: any) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

jest.mock('axios', () => ({
  post: jest.fn().mockResolvedValue({ data: { description: 'A generated description' } }),
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick }: any) {
    return (
      <button data-testid="submit-button" onClick={onClick}>
        {title}
      </button>
    );
  };
});

jest.mock('react-icons/gi', () => ({
  GiBattleGear: () => <span>Gear</span>,
  GiLinkedRings: () => <span>Rings</span>,
  GiMagicSwirl: () => <span>Swirl</span>,
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

    // Updated to include role, description, and token parameters
    expect(mockOnFormSubmit).toHaveBeenCalledWith('female', 'human', '', '', undefined);
  });

  it('calls onFormSubmit with token when provided', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" token="test-token" />);

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('female', 'human', '', '', 'test-token');
  });

  it('updates gender selection', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);

    const genderSelect = screen.getByTestId('nameGeneratorGender');
    fireEvent.change(genderSelect, { target: { value: 'male' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('male', 'human', '', '', undefined);
  });

  it('updates race selection', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);

    const raceSelect = screen.getByTestId('nameGeneratorRace');
    fireEvent.change(raceSelect, { target: { value: 'elf' } });

    const submitButton = screen.getByTestId('submit-button');
    fireEvent.click(submitButton);

    expect(mockOnFormSubmit).toHaveBeenCalledWith('female', 'elf', '', '', undefined);
  });

  it('displays name input for description generation', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);
    expect(screen.getByPlaceholderText(/Enter a name to enable AI description generation/i)).toBeInTheDocument();
  });

  it('displays description textarea', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);
    expect(screen.getByPlaceholderText(/Describe the NPC/i)).toBeInTheDocument();
  });

  it('disables generate button when name is empty', () => {
    render(<NameOptions onFormSubmit={mockOnFormSubmit} title="Name" />);
    const generateButton = screen.getByText('Generate');
    expect(generateButton.closest('button')).toBeDisabled();
  });
});
