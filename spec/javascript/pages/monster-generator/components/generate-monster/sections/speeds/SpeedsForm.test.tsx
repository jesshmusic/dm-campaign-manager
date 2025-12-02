import React from 'react';
import { render, screen, fireEvent } from '../../../../../../test-utils';
import SpeedsForm from '../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/speeds/SpeedsForm';

const mockAppend = jest.fn();
const mockRemove = jest.fn();
const mockFields: any[] = [];

jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useFieldArray: () => ({
    fields: mockFields,
    append: mockAppend,
    remove: mockRemove,
    prepend: jest.fn(),
    insert: jest.fn(),
    swap: jest.fn(),
    move: jest.fn(),
    update: jest.fn(),
    replace: jest.fn(),
  }),
}));

jest.mock('../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/speeds/SpeedForm', () => {
  return function MockSpeedForm({ speedIndex, remove }: any) {
    return (
      <div data-testid={`speed-form-${speedIndex}`}>
        <button onClick={() => remove(speedIndex)}>Remove {speedIndex}</button>
      </div>
    );
  };
});

jest.mock('../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

describe('SpeedsForm', () => {
  const mockTrigger = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFields.length = 0;
  });

  const defaultProps = {
    fieldName: 'speeds',
    useForm: {
      control: {} as any,
      formState: { errors: {} },
      register: jest.fn(),
      setValue: jest.fn(),
      trigger: mockTrigger,
      unregister: jest.fn(),
    } as any,
  };

  it('renders without crashing', () => {
    render(<SpeedsForm {...defaultProps} />);
  });

  it('renders Add Speed button', () => {
    render(<SpeedsForm {...defaultProps} />);
    expect(screen.getByText('Add Speed')).toBeInTheDocument();
  });

  it('calls append when Add Speed clicked', () => {
    render(<SpeedsForm {...defaultProps} />);
    const button = screen.getByText('Add Speed');
    fireEvent.click(button);
    expect(mockAppend).toHaveBeenCalledWith({
      nameOption: expect.any(Object),
      name: expect.any(String),
      value: '',
    });
  });

  it('renders SpeedForm for each field', () => {
    mockFields.push(
      { id: '1', nameOption: {}, name: 'walk', value: '30' },
      { id: '2', nameOption: {}, name: 'fly', value: '60' }
    );

    render(<SpeedsForm {...defaultProps} />);
    expect(screen.getByTestId('speed-form-0')).toBeInTheDocument();
    expect(screen.getByTestId('speed-form-1')).toBeInTheDocument();
  });

  it('calls remove when SpeedForm remove is clicked', () => {
    mockFields.push({ id: '1', nameOption: {}, name: 'walk', value: '30' });

    render(<SpeedsForm {...defaultProps} />);
    const removeButton = screen.getByText('Remove 0');
    fireEvent.click(removeButton);
    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('renders no SpeedForms when fields is empty', () => {
    render(<SpeedsForm {...defaultProps} />);
    expect(screen.queryByTestId('speed-form-0')).not.toBeInTheDocument();
  });
});
