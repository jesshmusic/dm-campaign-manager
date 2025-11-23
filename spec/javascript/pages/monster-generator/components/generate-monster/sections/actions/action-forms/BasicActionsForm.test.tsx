import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import BasicActionsForm from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/BasicActionsForm';

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/ActionForm', () => {
  return function MockActionForm({ actionIndex, remove }: any) {
    return (
      <div data-testid={`action-form-${actionIndex}`}>
        <button onClick={() => remove(actionIndex)}>Remove {actionIndex}</button>
      </div>
    );
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ onClick, title }: any) {
    return <button onClick={onClick}>{title}</button>;
  };
});

describe('BasicActionsForm', () => {
  const mockAppendAction = jest.fn();
  const mockHandleRemove = jest.fn();

  const defaultProps = {
    appendAction: mockAppendAction,
    fieldName: 'actions',
    fields: [],
    handleRemove: mockHandleRemove,
    singularTitle: 'Action',
    useForm: {
      control: {} as any,
      formState: { errors: {} },
    } as any,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BasicActionsForm {...defaultProps} />);
  });

  it('renders Add button with singular title', () => {
    render(<BasicActionsForm {...defaultProps} />);
    expect(screen.getByText('Add Action')).toBeInTheDocument();
  });

  it('renders different singular title', () => {
    render(<BasicActionsForm {...defaultProps} singularTitle="Reaction" />);
    expect(screen.getByText('Add Reaction')).toBeInTheDocument();
  });

  it('calls appendAction when Add button clicked', () => {
    render(<BasicActionsForm {...defaultProps} />);
    const button = screen.getByText('Add Action');
    fireEvent.click(button);
    expect(mockAppendAction).toHaveBeenCalledWith({
      desc: '',
      actionType: 'ability',
    });
  });

  it('renders ActionForm for each field', () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [
        { id: '1', desc: 'Action 1' },
        { id: '2', desc: 'Action 2' },
      ] as any,
    };

    render(<BasicActionsForm {...propsWithFields} />);
    expect(screen.getByTestId('action-form-0')).toBeInTheDocument();
    expect(screen.getByTestId('action-form-1')).toBeInTheDocument();
  });

  it('calls handleRemove when ActionForm remove clicked', () => {
    const propsWithFields = {
      ...defaultProps,
      fields: [{ id: '1', desc: 'Action 1' }] as any,
    };

    render(<BasicActionsForm {...propsWithFields} />);
    const removeButton = screen.getByText('Remove 0');
    fireEvent.click(removeButton);
    expect(mockHandleRemove).toHaveBeenCalledWith(0);
  });

  it('renders no ActionForms when fields is empty', () => {
    render(<BasicActionsForm {...defaultProps} />);
    expect(screen.queryByTestId('action-form-0')).not.toBeInTheDocument();
  });
});
