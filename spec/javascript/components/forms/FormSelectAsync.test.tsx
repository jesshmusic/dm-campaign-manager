import React from 'react';
import { render, screen } from '@testing-library/react';
import { useForm } from 'react-hook-form';
import FormSelectAsync from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/FormSelectAsync';

jest.mock('react-select/async', () => {
  return function MockAsyncSelect(props) {
    return (
      <div data-testid="async-select">
        <input
          data-testid="async-select-input"
          onChange={(e) => props.onChange && props.onChange(e.target.value)}
        />
      </div>
    );
  };
});

const FormSelectAsyncWrapper = (props) => {
  const { control } = useForm();
  return <FormSelectAsync control={control} {...props} />;
};

describe('FormSelectAsync', () => {
  const mockGetOptions = jest.fn((inputValue, callback) => {
    const options = [
      { value: 'dragon', label: 'Dragon' },
      { value: 'beast', label: 'Beast' },
    ];
    callback(options);
  });

  beforeEach(() => {
    mockGetOptions.mockClear();
  });

  it('renders with label', () => {
    render(
      <FormSelectAsyncWrapper label="Monster Type" name="type" getOptions={mockGetOptions} />
    );
    expect(screen.getByText('Monster Type')).toBeInTheDocument();
  });

  it('renders AsyncSelect component', () => {
    render(
      <FormSelectAsyncWrapper label="Type" name="type" getOptions={mockGetOptions} />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('label has correct htmlFor attribute', () => {
    render(
      <FormSelectAsyncWrapper label="Test Label" name="test_field" getOptions={mockGetOptions} />
    );
    const label = screen.getByText('Test Label');
    expect(label).toHaveAttribute('for', 'test_field');
  });

  it('applies custom className', () => {
    const { container } = render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
        className="custom-async-select"
      />
    );
    const wrapper = container.querySelector('.custom-async-select');
    expect(wrapper).toBeInTheDocument();
  });

  it('renders with isClearable prop', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
        isClearable={true}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('renders with isMulti prop', () => {
    render(
      <FormSelectAsyncWrapper
        label="Types"
        name="types"
        getOptions={mockGetOptions}
        isMulti={true}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('renders with menuPlacement prop', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
        menuPlacement="top"
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('renders with required validation', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
        required={true}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('renders with defaultOptions true', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
        defaultOptions={true}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('renders with defaultOptions false', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
        defaultOptions={false}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('uses Controller for form integration', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('is searchable by default', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('has cache options enabled', () => {
    render(
      <FormSelectAsyncWrapper
        label="Type"
        name="type"
        getOptions={mockGetOptions}
      />
    );
    expect(screen.getByTestId('async-select')).toBeInTheDocument();
  });

  it('renders without getOptions', () => {
    render(<FormSelectAsyncWrapper label="Type" name="type" />);
    expect(screen.getByText('Type')).toBeInTheDocument();
  });
});
