import React from 'react';
import { render, screen } from '@testing-library/react';
import BaseActionsFormSection from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/BaseActionsFormSection';
import { ActionVariations } from '../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/types';
import * as ReactHookForm from 'react-hook-form';

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/ActionsForm', () => {
  return function MockActionsForm({ singularTitle }: any) {
    return <div data-testid="actions-form">{singularTitle}</div>;
  };
});

jest.mock('../../../../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/sections/actions/action-forms/BasicActionsForm', () => {
  return function MockBasicActionsForm({ singularTitle }: any) {
    return <div data-testid="basic-actions-form">{singularTitle}</div>;
  };
});

describe('BaseActionsFormSection', () => {
  const mockAppend = jest.fn();
  const mockRemove = jest.fn();
  const mockTrigger = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(ReactHookForm, 'useFieldArray').mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
      prepend: jest.fn(),
      insert: jest.fn(),
      swap: jest.fn(),
      move: jest.fn(),
      update: jest.fn(),
      replace: jest.fn(),
    });
  });

  const defaultProps = {
    actionVariation: ActionVariations.action,
    fieldName: 'actions' as any,
    singularTitle: 'Action',
    useForm: {
      control: {} as any,
      setValue: jest.fn(),
      register: jest.fn(),
      unregister: jest.fn(),
      trigger: mockTrigger,
    } as any,
  };

  it('renders without crashing', () => {
    render(<BaseActionsFormSection {...defaultProps} />);
  });

  it('renders ActionsForm when actionVariation is action', () => {
    render(<BaseActionsFormSection {...defaultProps} actionVariation={ActionVariations.action} />);
    expect(screen.getByTestId('actions-form')).toBeInTheDocument();
  });

  it('renders BasicActionsForm when actionVariation is not action', () => {
    render(<BaseActionsFormSection {...defaultProps} actionVariation={ActionVariations.legendary} />);
    expect(screen.getByTestId('basic-actions-form')).toBeInTheDocument();
  });

  it('renders BasicActionsForm for reaction variation', () => {
    render(<BaseActionsFormSection {...defaultProps} actionVariation={ActionVariations.reaction} />);
    expect(screen.getByTestId('basic-actions-form')).toBeInTheDocument();
  });

  it('passes singularTitle to ActionsForm', () => {
    render(<BaseActionsFormSection {...defaultProps} singularTitle="Custom Action" />);
    expect(screen.getByText('Custom Action')).toBeInTheDocument();
  });

  it('passes singularTitle to BasicActionsForm', () => {
    render(
      <BaseActionsFormSection
        {...defaultProps}
        actionVariation={ActionVariations.legendary}
        singularTitle="Legendary Action"
      />
    );
    expect(screen.getByText('Legendary Action')).toBeInTheDocument();
  });

  it('triggers validation when fields become empty after initial render', () => {
    const { rerender } = render(<BaseActionsFormSection {...defaultProps} />);

    // Clear mocks from initial render
    mockTrigger.mockClear();

    // Simulate fields becoming empty
    jest.spyOn(ReactHookForm, 'useFieldArray').mockReturnValue({
      fields: [],
      append: mockAppend,
      remove: mockRemove,
      prepend: jest.fn(),
      insert: jest.fn(),
      swap: jest.fn(),
      move: jest.fn(),
      update: jest.fn(),
      replace: jest.fn(),
    });

    rerender(<BaseActionsFormSection {...defaultProps} />);

    expect(mockTrigger).toHaveBeenCalledWith('actions');
  });

  it('does not trigger validation on initial render with empty fields', () => {
    mockTrigger.mockClear();
    render(<BaseActionsFormSection {...defaultProps} />);
    expect(mockTrigger).not.toHaveBeenCalled();
  });
});
