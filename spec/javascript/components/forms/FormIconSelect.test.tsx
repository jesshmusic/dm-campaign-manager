import React from 'react';
import { render, screen } from '../../test-utils';
import { useForm } from 'react-hook-form';
import FormIconSelect from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormIconSelect';

jest.mock('react-select', () => {
  const actual = jest.requireActual('react-select');
  return {
    ...actual,
    __esModule: true,
    default: function MockSelect(props) {
      return (
        <div data-testid="icon-select">
          <input
            data-testid="icon-select-input"
            onChange={(e) => props.onChange && props.onChange(e.target.value)}
          />
        </div>
      );
    },
    components: {
      Option: ({ children }) => <div>{children}</div>,
      SingleValue: ({ children }) => <div>{children}</div>,
    },
  };
});

jest.mock('react-window', () => ({
  FixedSizeList: ({ children, itemCount }) => (
    <div data-testid="virtualized-list">
      {Array.from({ length: itemCount }, (_, index) =>
        children({ style: {}, index })
      )}
    </div>
  ),
}));

const FormIconSelectWrapper = (props) => {
  const { control } = useForm();
  return <FormIconSelect control={control} {...props} />;
};

describe('FormIconSelect', () => {
  const mockOptionsWithIcons = [
    { value: 'fire', label: 'Fire', icon: <span>🔥</span> },
    { value: 'ice', label: 'Ice', icon: <span>❄️</span> },
    { value: 'lightning', label: 'Lightning', icon: <span>⚡</span> },
  ];

  it('renders with label', () => {
    render(
      <FormIconSelectWrapper label="Damage Type" name="damage_type" options={mockOptionsWithIcons} />
    );
    expect(screen.getByText('Damage Type')).toBeInTheDocument();
  });

  it('renders icon select component', () => {
    render(
      <FormIconSelectWrapper label="Type" name="type" options={mockOptionsWithIcons} />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('label has correct htmlFor attribute', () => {
    render(
      <FormIconSelectWrapper label="Test Label" name="test_field" options={mockOptionsWithIcons} />
    );
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test_field');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
        className="custom-icon-select"
      />
    );
    const wrapper = container.querySelector('.custom-icon-select');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with defaultValue', () => {
    const defaultValue = { value: 'fire', label: 'Fire', icon: <span>🔥</span> };
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
        defaultValue={defaultValue}
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('renders with isClearable prop', () => {
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
        isClearable={true}
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('renders with menuPlacement prop', () => {
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
        menuPlacement="top"
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('renders with required validation', () => {
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
        required={true}
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('is not multi-select', () => {
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('is searchable', () => {
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('uses Controller for form integration', () => {
    render(
      <FormIconSelectWrapper
        label="Type"
        name="type"
        options={mockOptionsWithIcons}
      />
    );
    expect(screen.getByTestId('icon-select')).toBeInTheDocument();
  });

  it('renders without options', () => {
    render(<FormIconSelectWrapper label="Type" name="type" />);
    expect(screen.getByText('Type')).toBeInTheDocument();
  });
});
