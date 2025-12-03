import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { useForm } from 'react-hook-form';
import { ControllerInput, ControlledInput, TagInput } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/forms/ControllerInput';

jest.mock('react-icons/all', () => ({
  GiFire: () => <svg data-testid="fire-icon" />,
}));

describe('ControllerInput', () => {
  it('renders text input', () => {
    render(<ControllerInput type="text" label="Name" name="name" errors={{}} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
  });

  it('renders checkbox input', () => {
    render(<ControllerInput type="checkbox" label="Agree" name="agree" errors={{}} />);
    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeInTheDocument();
  });

  it('renders radio input', () => {
    render(<ControllerInput type="radio" label="Option" name="option" errors={{}} />);
    const radio = screen.getByRole('radio');
    expect(radio).toBeInTheDocument();
  });

  it('renders textarea when isTextArea is true', () => {
    const { container } = render(<ControllerInput label="Description" name="desc" errors={{}} isTextArea={true} />);
    const textarea = container.querySelector('textarea');
    expect(textarea).toBeInTheDocument();
  });

  it('shows error message when field has error', () => {
    const errors = { name: { type: 'required', message: 'This is required' } };
    render(<ControllerInput type="text" label="Name" name="name" errors={errors} />);
    expect(screen.getByText('This is required')).toBeInTheDocument();
  });

  it('applies placeholder', () => {
    render(<ControllerInput type="text" label="Name" name="name" placeholder="Enter name" errors={{}} />);
    expect(screen.getByPlaceholderText('Enter name')).toBeInTheDocument();
  });
});

const ControlledInputWrapper = (props) => {
  const { control } = useForm();
  return <ControlledInput control={control} errors={{}} {...props} />;
};

describe('ControlledInput', () => {
  it('renders with controller', () => {
    render(<ControlledInputWrapper fieldName="test" label="Test Field" />);
    expect(screen.getByText('Test Field')).toBeInTheDocument();
  });

  it('sets default placeholder', () => {
    render(<ControlledInputWrapper fieldName="name" label="Name" />);
    expect(screen.getByPlaceholderText('Name...')).toBeInTheDocument();
  });
});

describe('TagInput', () => {
  it('renders label', () => {
    render(<TagInput tags={[]} onChange={jest.fn()} label="Tags" />);
    expect(screen.getByText('Tags')).toBeInTheDocument();
  });

  it('displays existing tags', () => {
    render(<TagInput tags={['React', 'TypeScript']} onChange={jest.fn()} label="Tags" />);
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('TypeScript')).toBeInTheDocument();
  });

  it('calls onChange when adding tag with Enter', () => {
    const onChange = jest.fn();
    render(<TagInput tags={[]} onChange={onChange} label="Tags" />);
    const input = screen.getByPlaceholderText('Add tags...');

    fireEvent.change(input, { target: { value: 'NewTag' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).toHaveBeenCalledWith(['NewTag']);
  });

  it('calls onChange when adding tag with comma', () => {
    const onChange = jest.fn();
    render(<TagInput tags={[]} onChange={onChange} label="Tags" />);
    const input = screen.getByPlaceholderText('Add tags...');

    fireEvent.change(input, { target: { value: 'NewTag,' } });

    expect(onChange).toHaveBeenCalledWith(['NewTag']);
  });

  it('removes tag when clicking × button', () => {
    const onChange = jest.fn();
    render(<TagInput tags={['Tag1', 'Tag2']} onChange={onChange} label="Tags" />);
    const removeButtons = screen.getAllByText('×');

    fireEvent.click(removeButtons[0]);

    expect(onChange).toHaveBeenCalledWith(['Tag2']);
  });

  it('does not add duplicate tags', () => {
    const onChange = jest.fn();
    render(<TagInput tags={['Existing']} onChange={onChange} label="Tags" />);
    const input = screen.getByPlaceholderText('Add tags...');

    fireEvent.change(input, { target: { value: 'Existing' } });
    fireEvent.keyDown(input, { key: 'Enter' });

    expect(onChange).not.toHaveBeenCalled();
  });

  it('applies custom placeholder', () => {
    render(<TagInput tags={[]} onChange={jest.fn()} label="Tags" placeholder="Custom..." />);
    expect(screen.getByPlaceholderText('Custom...')).toBeInTheDocument();
  });
});
