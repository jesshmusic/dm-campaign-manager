import React from 'react';
import styled from 'styled-components';
import { GiPencil, GiTrashCan } from 'react-icons/gi';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { UserProps } from '../../utilities/types';

const ActionsWrapper = styled.div<{ $size?: 'small' | 'medium' }>`
  align-items: center;
  display: flex;
  gap: ${({ $size }) => ($size === 'small' ? '0.25rem' : '0.5rem')};
`;

type AdminActionsProps = {
  currentUser?: UserProps;
  onEdit: () => void;
  onDelete: () => void;
  size?: 'small' | 'medium';
  editLabel?: string;
  deleteLabel?: string;
};

const AdminActions: React.FC<AdminActionsProps> = ({
  currentUser,
  onEdit,
  onDelete,
  size = 'medium',
  editLabel = 'Edit',
  deleteLabel = 'Delete',
}) => {
  // Only render for admin users
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  const iconSize = size === 'small' ? 20 : 24;

  return (
    <ActionsWrapper $size={size}>
      <Button
        color={Colors.info}
        title={editLabel}
        onClick={onEdit}
        icon={<GiPencil size={iconSize} />}
        hideTitle={size === 'small'}
      />
      <Button
        color={Colors.danger}
        title={deleteLabel}
        onClick={onDelete}
        icon={<GiTrashCan size={iconSize} />}
        hideTitle={size === 'small'}
      />
    </ActionsWrapper>
  );
};

export default AdminActions;
