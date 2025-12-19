import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import RecordFormModal from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared/modals/RecordFormModal';

jest.mock('react-icons/gi', () => ({
  GiSave: () => <svg data-testid="save-icon" />,
  GiTrashCan: () => <svg data-testid="trash-icon" />,
}));

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({
    title,
    onClick,
    disabled,
  }: {
    title: string;
    onClick: () => void;
    disabled?: boolean;
  }) {
    return (
      <button onClick={onClick} disabled={disabled} data-testid={`button-${title.toLowerCase().replace('...', '')}`}>
        {title}
      </button>
    );
  };
});

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared/modals/Modal.styles',
  () => ({
    ModalOverlay: ({ children, onClick }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void }) => (
      <div data-testid="modal-overlay" onClick={onClick}>
        {children}
      </div>
    ),
    ModalContent: ({ children, onClick }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void }) => (
      <div data-testid="modal-content" onClick={onClick}>
        {children}
      </div>
    ),
    ModalHeader: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-header">{children}</div>,
    CloseButton: ({
      children,
      onClick,
      disabled,
    }: {
      children: React.ReactNode;
      onClick: () => void;
      disabled?: boolean;
    }) => (
      <button data-testid="close-button" onClick={onClick} disabled={disabled}>
        {children}
      </button>
    ),
    ModalBody: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-body">{children}</div>,
    ModalFooterSpaceBetween: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="modal-footer">{children}</div>
    ),
  }),
);

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared/modals/DeleteConfirmModal',
  () => {
    return function MockDeleteConfirmModal({
      isOpen,
      onClose,
      onConfirm,
    }: {
      isOpen: boolean;
      onClose: () => void;
      onConfirm: () => void;
    }) {
      if (!isOpen) return null;
      return (
        <div data-testid="delete-confirm-modal">
          <button data-testid="delete-confirm-cancel" onClick={onClose}>
            Cancel Delete
          </button>
          <button data-testid="delete-confirm-confirm" onClick={onConfirm}>
            Confirm Delete
          </button>
        </div>
      );
    };
  },
);

describe('RecordFormModal', () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const mockOnDelete = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    title: 'Edit Monster',
    mode: 'edit' as const,
    entityName: 'monster',
    entityTitle: 'Ancient Red Dragon',
    children: <div>Form content</div>,
    onSave: mockOnSave,
    onDelete: mockOnDelete,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<RecordFormModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal with title when isOpen is true', () => {
    render(<RecordFormModal {...defaultProps} />);
    expect(screen.getByText('Edit Monster')).toBeInTheDocument();
  });

  it('renders children content', () => {
    render(<RecordFormModal {...defaultProps} />);
    expect(screen.getByText('Form content')).toBeInTheDocument();
  });

  it('shows Save and Cancel buttons', () => {
    render(<RecordFormModal {...defaultProps} />);
    expect(screen.getByTestId('button-save')).toBeInTheDocument();
    expect(screen.getByTestId('button-cancel')).toBeInTheDocument();
  });

  it('shows Delete button in edit mode with onDelete', () => {
    render(<RecordFormModal {...defaultProps} />);
    expect(screen.getByTestId('button-delete')).toBeInTheDocument();
  });

  it('does not show Delete button in create mode', () => {
    render(<RecordFormModal {...defaultProps} mode="create" />);
    expect(screen.queryByTestId('button-delete')).not.toBeInTheDocument();
  });

  it('does not show Delete button when onDelete is not provided', () => {
    render(<RecordFormModal {...defaultProps} onDelete={undefined} />);
    expect(screen.queryByTestId('button-delete')).not.toBeInTheDocument();
  });

  it('calls onSave when Save button is clicked', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-save'));
    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button (×) is clicked', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('opens delete confirmation when Delete button is clicked', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-delete'));
    expect(screen.getByTestId('delete-confirm-modal')).toBeInTheDocument();
  });

  it('calls onDelete when delete is confirmed', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-delete'));
    fireEvent.click(screen.getByTestId('delete-confirm-confirm'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('closes delete confirmation when cancelled', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-delete'));
    expect(screen.getByTestId('delete-confirm-modal')).toBeInTheDocument();
    fireEvent.click(screen.getByTestId('delete-confirm-cancel'));
    expect(screen.queryByTestId('delete-confirm-modal')).not.toBeInTheDocument();
  });

  it('shows "Saving..." text when isSaving is true', () => {
    render(<RecordFormModal {...defaultProps} isSaving={true} />);
    expect(screen.getByTestId('button-saving')).toBeInTheDocument();
  });

  it('disables buttons when isSaving is true', () => {
    render(<RecordFormModal {...defaultProps} isSaving={true} />);
    expect(screen.getByTestId('button-cancel')).toBeDisabled();
    expect(screen.getByTestId('button-saving')).toBeDisabled();
    expect(screen.getByTestId('button-delete')).toBeDisabled();
    expect(screen.getByTestId('close-button')).toBeDisabled();
  });

  it('disables Save button when isValid is false', () => {
    render(<RecordFormModal {...defaultProps} isValid={false} />);
    expect(screen.getByTestId('button-save')).toBeDisabled();
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<RecordFormModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape is pressed while saving', () => {
    render(<RecordFormModal {...defaultProps} isSaving={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });
});
