import React, { useEffect, useCallback, useState } from 'react';
import ReactDOM from 'react-dom';
import { GiSave, GiTrashCan } from 'react-icons/gi';
import Button from '../../Button/Button';
import { Colors } from '../../../utilities/enums';
import DeleteConfirmModal from './DeleteConfirmModal';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  ModalFooterSpaceBetween,
} from './Modal.styles';

type RecordFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  mode: 'create' | 'edit';
  entityName: string;
  entityTitle?: string;
  children: React.ReactNode;
  onSave: () => void;
  onDelete?: () => void;
  isSaving?: boolean;
  isDeleting?: boolean;
  isValid?: boolean;
  maxWidth?: string;
};

const RecordFormModal: React.FC<RecordFormModalProps> = ({
  isOpen,
  onClose,
  title,
  mode,
  entityName,
  entityTitle,
  children,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
  isValid = true,
  maxWidth = '900px',
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const isProcessing = isSaving || isDeleting;

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isProcessing && !showDeleteConfirm) {
        onClose();
      }
    },
    [onClose, isProcessing, showDeleteConfirm],
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isProcessing) {
      onClose();
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    setShowDeleteConfirm(false);
    onDelete?.();
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
  };

  if (!isOpen) return null;

  const modal = (
    <>
      <ModalOverlay onClick={handleOverlayClick}>
        <ModalContent $maxWidth={maxWidth} onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <h2>{title}</h2>
            <CloseButton onClick={onClose} disabled={isProcessing}>
              &times;
            </CloseButton>
          </ModalHeader>
          <ModalBody>{children}</ModalBody>
          <ModalFooterSpaceBetween>
            <div>
              {mode === 'edit' && onDelete && (
                <Button
                  color={Colors.danger}
                  title="Delete"
                  onClick={handleDeleteClick}
                  disabled={isProcessing}
                  icon={<GiTrashCan />}
                />
              )}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <Button
                color={Colors.secondary}
                title="Cancel"
                onClick={onClose}
                disabled={isProcessing}
              />
              <Button
                color={Colors.success}
                title={isSaving ? 'Saving...' : 'Save'}
                onClick={onSave}
                disabled={isProcessing || !isValid}
                icon={<GiSave />}
              />
            </div>
          </ModalFooterSpaceBetween>
        </ModalContent>
      </ModalOverlay>
      <DeleteConfirmModal
        isOpen={showDeleteConfirm}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        entityName={entityName}
        entityTitle={entityTitle || 'this item'}
        isDeleting={isDeleting}
      />
    </>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default RecordFormModal;
