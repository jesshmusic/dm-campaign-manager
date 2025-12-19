import React from 'react';
import { GiFeather } from 'react-icons/gi';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';
import { UserProps } from '../../utilities/types';

type AdminNewButtonProps = {
  currentUser?: UserProps;
  onClick: () => void;
  label?: string;
};

const AdminNewButton: React.FC<AdminNewButtonProps> = ({ currentUser, onClick, label = 'New' }) => {
  // Only render for admin users
  if (!currentUser || currentUser.role !== 'admin') {
    return null;
  }

  return <Button color={Colors.success} title={label} onClick={onClick} icon={<GiFeather />} />;
};

export default AdminNewButton;
