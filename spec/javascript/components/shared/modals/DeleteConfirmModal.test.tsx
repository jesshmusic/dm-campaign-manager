import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';
import DeleteConfirmModal from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared/modals/DeleteConfirmModal';

jest.mock('react-icons/gi', () => ({
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
      <button onClick={onClick} disabled={disabled} data-testid={`button-${title.toLowerCase()}`}>
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
    ModalFooter: ({ children }: { children: React.ReactNode }) => <div data-testid="modal-footer">{children}</div>,
    DeleteWarningIcon: ({ children }: { children: React.ReactNode }) => (
      <div data-testid="warning-icon">{children}</div>
    ),
    DeleteWarningText: ({ children }: { children: React.ReactNode }) => (
      <p data-testid="warning-text">{children}</p>
    ),
    DeleteEntityName: ({ children }: { children: React.ReactNode }) => (
      <p data-testid="entity-name">{children}</p>
    ),
  }),
);

describe('DeleteConfirmModal', () => {
  const mockOnClose = jest.fn();
  const mockOnConfirm = jest.fn();

  const defaultProps = {
    isOpen: true,
    onClose: mockOnClose,
    onConfirm: mockOnConfirm,
    entityName: 'monster',
    entityTitle: 'Ancient Red Dragon',
    isDeleting: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when isOpen is false', () => {
    const { container } = render(<DeleteConfirmModal {...defaultProps} isOpen={false} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders modal when isOpen is true', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Confirm Delete')).toBeInTheDocument();
  });

  it('displays entity name in warning message', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Are you sure you want to delete this monster?')).toBeInTheDocument();
  });

  it('displays entity title', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('Ancient Red Dragon')).toBeInTheDocument();
  });

  it('displays cannot be undone warning', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByText('This action cannot be undone.')).toBeInTheDocument();
  });

  it('calls onClose when Cancel button is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-cancel'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onConfirm when Delete button is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-delete'));
    expect(mockOnConfirm).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when close button (×) is clicked', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('calls onClose when Escape key is pressed', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('does not call onClose when Escape is pressed while deleting', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows "Deleting..." text when isDeleting is true', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />);
    expect(screen.getByTestId('button-deleting...')).toBeInTheDocument();
  });

  it('disables buttons when isDeleting is true', () => {
    render(<DeleteConfirmModal {...defaultProps} isDeleting={true} />);
    expect(screen.getByTestId('button-cancel')).toBeDisabled();
    expect(screen.getByTestId('button-deleting...')).toBeDisabled();
    expect(screen.getByTestId('close-button')).toBeDisabled();
  });

  it('renders trash icon in warning section', () => {
    render(<DeleteConfirmModal {...defaultProps} />);
    expect(screen.getByTestId('trash-icon')).toBeInTheDocument();
  });
});
