import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import AdminNewButton from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/shared/AdminNewButton';
import { UserProps } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/utilities/types';

jest.mock('react-icons/gi', () => ({
  GiFeather: () => <svg data-testid="feather-icon" />,
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

describe('AdminNewButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders nothing when currentUser is undefined', () => {
    const { container } = render(<AdminNewButton currentUser={undefined} onClick={mockOnClick} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders nothing when currentUser is not an admin', () => {
    const { container } = render(<AdminNewButton currentUser={mockRegularUser} onClick={mockOnClick} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders button with default label for admin users', () => {
    render(<AdminNewButton currentUser={mockAdminUser} onClick={mockOnClick} />);
    expect(screen.getByTitle('New')).toBeInTheDocument();
    expect(screen.getByText('New')).toBeInTheDocument();
  });

  it('calls onClick when button is clicked', () => {
    render(<AdminNewButton currentUser={mockAdminUser} onClick={mockOnClick} />);
    fireEvent.click(screen.getByTitle('New'));
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('renders with custom label', () => {
    render(<AdminNewButton currentUser={mockAdminUser} onClick={mockOnClick} label="Create Monster" />);
    expect(screen.getByTitle('Create Monster')).toBeInTheDocument();
    expect(screen.getByText('Create Monster')).toBeInTheDocument();
  });

  it('renders nothing for dungeon-master role (not admin)', () => {
    const dmUser: UserProps = { ...mockRegularUser, role: 'dungeon-master' };
    const { container } = render(<AdminNewButton currentUser={dmUser} onClick={mockOnClick} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders feather icon', () => {
    render(<AdminNewButton currentUser={mockAdminUser} onClick={mockOnClick} />);
    expect(screen.getByTestId('feather-icon')).toBeInTheDocument();
  });
});
