import React from 'react';
import { render, screen, fireEvent, waitFor } from '../../test-utils';
import FeatForm from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/feats/FeatForm';
import { Feat } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/reducers/feats';

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

jest.mock('react-select', () => {
  return function MockSelect({
    options,
    value,
    onChange,
  }: {
    options: { value: string; label: string }[];
    value: { value: string; label: string } | null;
    onChange: (option: { value: string; label: string } | null) => void;
  }) {
    return (
      <select
        data-testid="category-select"
        value={value?.value || ''}
        onChange={(e) => {
          const option = options.find((opt) => opt.value === e.target.value);
          onChange(option || null);
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  };
});

describe('FeatForm', () => {
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders form fields', () => {
    render(<FeatForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Name...')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Prerequisite...')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByText('Repeatable')).toBeInTheDocument();
  });

  it('renders with default values for new feat', () => {
    render(<FeatForm onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Name...')).toHaveValue('');
    expect(screen.getByTestId('category-select')).toHaveValue('General');
    expect(screen.getByPlaceholderText('Prerequisite...')).toHaveValue('');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('populates form with initialData', () => {
    const initialData: Feat = {
      id: 1,
      slug: 'great-weapon-master',
      name: 'Great Weapon Master',
      category: 'Fighting Style',
      prerequisite: 'Strength 13 or higher',
      description: '<p>When you score a critical hit...</p>',
      repeatable: true,
    };

    render(<FeatForm initialData={initialData} onSubmit={mockOnSubmit} />);

    expect(screen.getByPlaceholderText('Name...')).toHaveValue('Great Weapon Master');
    expect(screen.getByTestId('category-select')).toHaveValue('Fighting Style');
    expect(screen.getByPlaceholderText('Prerequisite...')).toHaveValue('Strength 13 or higher');
    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('has form with correct id for external submission', () => {
    const { container } = render(<FeatForm onSubmit={mockOnSubmit} />);

    expect(container.querySelector('#feat-form')).toBeInTheDocument();
  });

  it('calls onSubmit when form is submitted', async () => {
    render(<FeatForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByPlaceholderText('Name...'), { target: { value: 'Test Feat' } });
    fireEvent.change(screen.getByPlaceholderText('Prerequisite...'), { target: { value: 'Level 4' } });

    const form = document.getElementById('feat-form') as HTMLFormElement;
    fireEvent.submit(form);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Feat',
          category: 'General',
          prerequisite: 'Level 4',
        }),
        expect.anything()
      );
    });
  });

  it('allows changing category', () => {
    render(<FeatForm onSubmit={mockOnSubmit} />);

    fireEvent.change(screen.getByTestId('category-select'), { target: { value: 'Epic Boon' } });

    expect(screen.getByTestId('category-select')).toHaveValue('Epic Boon');
  });

  it('allows toggling repeatable checkbox', () => {
    render(<FeatForm onSubmit={mockOnSubmit} />);

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();

    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();
  });

  it('renders all category options', () => {
    render(<FeatForm onSubmit={mockOnSubmit} />);

    const select = screen.getByTestId('category-select');
    expect(select).toContainElement(screen.getByRole('option', { name: 'Origin' }));
    expect(select).toContainElement(screen.getByRole('option', { name: 'General' }));
    expect(select).toContainElement(screen.getByRole('option', { name: 'Fighting Style' }));
    expect(select).toContainElement(screen.getByRole('option', { name: 'Epic Boon' }));
  });
});
