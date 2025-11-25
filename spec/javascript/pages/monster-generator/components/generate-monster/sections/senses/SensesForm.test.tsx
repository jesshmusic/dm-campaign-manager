import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import SensesForm from '../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/senses/SensesForm';

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

jest.mock('../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/senses/SenseForm', () => {
  return function MockSenseForm({ senseIndex, remove }: any) {
    return (
      <div data-testid={`sense-form-${senseIndex}`}>
        <button onClick={() => remove(senseIndex)}>Remove {senseIndex}</button>
      </div>
    );
  };
});

jest.mock('../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

describe('SensesForm', () => {
  const mockTrigger = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockFields.length = 0;
  });

  const defaultProps = {
    fieldName: 'senses',
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
    render(<SensesForm {...defaultProps} />);
  });

  it('renders Add Sense button', () => {
    render(<SensesForm {...defaultProps} />);
    expect(screen.getByText('Add Sense')).toBeInTheDocument();
  });

  it('calls append when Add Sense clicked', () => {
    render(<SensesForm {...defaultProps} />);
    const button = screen.getByText('Add Sense');
    fireEvent.click(button);
    expect(mockAppend).toHaveBeenCalledWith({
      nameOption: expect.any(Object),
      name: expect.any(String),
      value: '',
    });
  });

  it('renders SenseForm for each field', () => {
    mockFields.push(
      { id: '1', nameOption: {}, name: 'darkvision', value: '60' },
      { id: '2', nameOption: {}, name: 'blindsight', value: '30' }
    );

    render(<SensesForm {...defaultProps} />);
    expect(screen.getByTestId('sense-form-0')).toBeInTheDocument();
    expect(screen.getByTestId('sense-form-1')).toBeInTheDocument();
  });

  it('calls remove when SenseForm remove is clicked', () => {
    mockFields.push({ id: '1', nameOption: {}, name: 'darkvision', value: '60' });

    render(<SensesForm {...defaultProps} />);
    const removeButton = screen.getByText('Remove 0');
    fireEvent.click(removeButton);
    expect(mockRemove).toHaveBeenCalledWith(0);
  });

  it('renders no SenseForms when fields is empty', () => {
    render(<SensesForm {...defaultProps} />);
    expect(screen.queryByTestId('sense-form-0')).not.toBeInTheDocument();
  });
});
