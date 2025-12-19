import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { GiTrashCan } from 'react-icons/gi';
import Button from '../../Button/Button';
import { Colors } from '../../../utilities/enums';
import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  CloseButton,
  ModalBody,
  ModalFooter,
  DeleteWarningIcon,
  DeleteWarningText,
  DeleteEntityName,
} from './Modal.styles';

type DeleteConfirmModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  entityName: string;
  entityTitle: string;
  isDeleting?: boolean;
};

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  entityName,
  entityTitle,
  isDeleting = false,
}) => {
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isDeleting) {
        onClose();
      }
    },
    [onClose, isDeleting],
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
    if (e.target === e.currentTarget && !isDeleting) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const modal = (
    <ModalOverlay onClick={handleOverlayClick}>
      <ModalContent $maxWidth="450px" onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <h2>Confirm Delete</h2>
          <CloseButton onClick={onClose} disabled={isDeleting}>
            &times;
          </CloseButton>
        </ModalHeader>
        <ModalBody>
          <DeleteWarningIcon>
            <GiTrashCan />
          </DeleteWarningIcon>
          <DeleteWarningText>Are you sure you want to delete this {entityName}?</DeleteWarningText>
          <DeleteEntityName>{entityTitle}</DeleteEntityName>
          <DeleteWarningText>This action cannot be undone.</DeleteWarningText>
        </ModalBody>
        <ModalFooter>
          <Button color={Colors.secondary} title="Cancel" onClick={onClose} disabled={isDeleting} />
          <Button
            color={Colors.danger}
            title={isDeleting ? 'Deleting...' : 'Delete'}
            onClick={onConfirm}
            disabled={isDeleting}
            icon={<GiTrashCan />}
          />
        </ModalFooter>
      </ModalContent>
    </ModalOverlay>
  );

  return ReactDOM.createPortal(modal, document.body);
};

export default DeleteConfirmModal;
