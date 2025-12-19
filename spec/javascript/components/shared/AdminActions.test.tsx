import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import AdminActions from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared/AdminActions';
import { UserProps } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/types';

jest.mock('react-icons/gi', () => ({
  GiPencil: () => <svg data-testid="pencil-icon" />,
  GiTrashCan: () => <svg data-testid="trash-icon" />,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title, onClick, icon }: { title: string; onClick: () => void; icon?: React.ReactNode }) {
    return (
      <button onClick={onClick} title={title} data-testid={`button-${title.toLowerCase()}`}>
        {icon}
        {title}
      </button>
    );
  };
});

const mockAdminUser: UserProps = {
  id: 1,
  name: 'Admin User',
  email: 'admin@test.com',
  username: 'admin',
  role: 'admin',
  auth_id: 'auth0|123',
  dndClasses: [],
  items: [],
  monsters: [],
  spells: [],
};

const mockRegularUser: UserProps = {
  id: 2,
  name: 'Regular User',
  email: 'user@test.com',
  username: 'user',
  role: 'user',
  auth_id: 'auth0|456',
  dndClasses: [],
  items: [],
  monsters: [],
  spells: [],
};

describe('AdminActions', () => {
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when currentUser is undefined', () => {
    const { container } = render(
      <AdminActions currentUser={undefined} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when currentUser is not an admin', () => {
    const { container } = render(
      <AdminActions currentUser={mockRegularUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders edit and delete buttons for admin users', () => {
    render(
      <AdminActions currentUser={mockAdminUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('calls onEdit when edit button is clicked', () => {
    render(
      <AdminActions currentUser={mockAdminUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    fireEvent.click(screen.getByTitle('Edit'));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
  });

  it('calls onDelete when delete button is clicked', () => {
    render(
      <AdminActions currentUser={mockAdminUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    fireEvent.click(screen.getByTitle('Delete'));
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('renders with custom labels', () => {
    render(
      <AdminActions
        currentUser={mockAdminUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        editLabel="Modify"
        deleteLabel="Remove"
      />
    );
    expect(screen.getByTitle('Modify')).toBeInTheDocument();
    expect(screen.getByTitle('Remove')).toBeInTheDocument();
  });

  it('renders in small size', () => {
    render(
      <AdminActions
        currentUser={mockAdminUser}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        size="small"
      />
    );
    // Buttons should still be present
    expect(screen.getByTitle('Edit')).toBeInTheDocument();
    expect(screen.getByTitle('Delete')).toBeInTheDocument();
  });

  it('renders nothing for dungeon-master role (not admin)', () => {
    const dmUser: UserProps = { ...mockRegularUser, role: 'dungeon-master' };
    const { container } = render(
      <AdminActions currentUser={dmUser} onEdit={mockOnEdit} onDelete={mockOnDelete} />
    );
    expect(container.firstChild).toBeNull();
  });
});
