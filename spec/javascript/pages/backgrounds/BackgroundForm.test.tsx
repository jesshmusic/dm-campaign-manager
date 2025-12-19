import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import BackgroundForm from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/backgrounds/BackgroundForm';
import { Background } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/backgrounds';

jest.mock('react-quill', () => {
  return function MockReactQuill({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    return (
      <textarea
        data-testid="quill-editor"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    );
  };
});

jest.mock('react-quill/dist/quill.snow.css', () => ({}));

describe('BackgroundForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<BackgroundForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Name...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Feat Name...')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Tool Proficiency...')).toBeInTheDocument();
    expect(screen.getByText('Skill Proficiencies')).toBeInTheDocument();
    expect(screen.getByText('Ability Scores')).toBeInTheDocument();
    expect(screen.getByText('Equipment Option A')).toBeInTheDocument();
    expect(screen.getByText('Equipment Option B')).toBeInTheDocument();
    expect(screen.getByText('Homebrew')).toBeInTheDocument();
  });

  it('renders with default values for new background', () => {
    render(<BackgroundForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Name...')).toHaveValue('');
    expect(screen.getByPlaceholderText('Feat Name...')).toHaveValue('');
    expect(screen.getByPlaceholderText('Tool Proficiency...')).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('populates form with initialData', () => {
    const initialData: Background = {
      id: 1,
      slug: 'acolyte',
      name: 'Acolyte',
      description: '<p>You have spent your life...</p>',
      feat_name: 'Magic Initiate',
      tool_proficiency: 'Calligrapher\'s Supplies',
      equipment_option_a: 'A holy symbol',
      equipment_option_b: '50 gp',
      abilityScores: ['Intelligence', 'Wisdom', 'Charisma'],
      skillProficiencies: ['Insight', 'Religion'],
      homebrew: false,
    };

    render(<BackgroundForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Name...')).toHaveValue('Acolyte');
    expect(screen.getByPlaceholderText('Feat Name...')).toHaveValue('Magic Initiate');
    expect(screen.getByPlaceholderText('Tool Proficiency...')).toHaveValue("Calligrapher's Supplies");
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('has form with correct id for external submission', () => {
    const { container } = render(<BackgroundForm onSubmit={mockOnSubmit} />);

    expect(container.querySelector('#background-form')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    render(<BackgroundForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Name...'), { target: { value: 'Test Background' } });
    fireEvent.change(screen.getByPlaceholderText('Feat Name...'), { target: { value: 'Test Feat' } });

    const form = document.getElementById('background-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Background',
          feat_name: 'Test Feat',
        }),
        expect.anything()
      );
    });
  });

  it('allows toggling homebrew checkbox', () => {
    render(<BackgroundForm onSubmit={mockOnSubmit} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('renders textarea fields for equipment options', () => {
    render(<BackgroundForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Equipment Option A...')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Equipment Option B...')).toBeInTheDocument();
  });

  it('shows homebrew checkbox checked when initialData.homebrew is true', () => {
    const initialData: Background = {
      id: 1,
      slug: 'custom-background',
      name: 'Custom Background',
      description: '',
      feat_name: '',
      tool_proficiency: '',
      equipment_option_a: '',
      equipment_option_b: '',
      abilityScores: [],
      skillProficiencies: [],
      homebrew: true,
    };

    render(<BackgroundForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });
});
