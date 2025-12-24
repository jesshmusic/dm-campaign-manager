import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent } from '../../../test-utils';

// Create mock getUsers function
const mockGetUsers = jest.fn();

// Mock DataTable to avoid complex component issues
jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/DataTable/DataTable',
  () => {
    return function MockDataTable({
      data,
      columns,
      onSearch,
      loading,
    }: {
      data: Array<{
        id: number;
        name: string;
        role: string;
        monsters: number;
        createdAt: string;
        lastSignInAt: string;
      }>;
      columns: Array<{ Header: string; accessor: string }>;
      onSearch: (term: string) => void;
      loading: boolean;
    }) {
      if (loading) {
        return <div data-testid="loading">Loading...</div>;
      }
      return (
        <div data-testid="mock-data-table">
          <input
            data-testid="search-input"
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search"
          />
          <table>
            <thead>
              <tr>
                {columns.map((col) => (
                  <th key={col.accessor} data-testid={`header-${col.accessor}`}>
                    {col.Header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row) => (
                <tr key={row.id} data-testid={`row-${row.id}`}>
                  <td data-testid={`name-${row.id}`}>{row.name}</td>
                  <td data-testid={`role-${row.id}`}>{row.role}</td>
                  <td data-testid={`monsters-${row.id}`}>{row.monsters}</td>
                  <td data-testid={`createdAt-${row.id}`}>{row.createdAt}</td>
                  <td data-testid={`lastSignInAt-${row.id}`}>{row.lastSignInAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div data-testid="results-count">{data.length} results</div>
        </div>
      );
    };
  },
);

// Mock react-redux connect to inject our mock props directly
jest.mock('react-redux', () => ({
  connect: () => (Component: React.ComponentType<any>) => {
    return function MockConnectedComponent(props: any) {
      return <Component {...props} />;
    };
  },
}));

// Import the component after mocking react-redux
// eslint-disable-next-line @typescript-eslint/no-var-requires
const UsersTableModule = require('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/components/UsersTable');
const UsersTable = UsersTableModule.default;

const mockUsers = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john@example.com',
    username: 'johndoe',
    role: 'admin' as const,
    auth_id: 'auth123',
    createdAt: '2024-01-15T10:30:00Z',
    lastSignInAt: '2024-12-20T14:45:00Z',
    dndClasses: [],
    items: [],
    monsters: [{ id: 1 }, { id: 2 }],
    spells: [],
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane@example.com',
    username: 'janesmith',
    role: 'dungeon-master' as const,
    auth_id: 'auth456',
    createdAt: '2024-06-01T08:00:00Z',
    lastSignInAt: undefined,
    dndClasses: [],
    items: [],
    monsters: [],
    spells: [],
  },
];

const renderUsersTable = (users = mockUsers) => {
  return render(
    <UsersTable
      getUsers={mockGetUsers}
      users={users}
      loading={false}
      user={{ id: 1, name: 'Admin' }}
    />,
  );
};

describe('UsersTable Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('rendering', () => {
    it('should render without crashing', () => {
      renderUsersTable();
      expect(screen.getByTestId('mock-data-table')).toBeInTheDocument();
    });

    it('should display user names', () => {
      renderUsersTable();
      expect(screen.getByTestId('name-1')).toHaveTextContent('John Doe');
      expect(screen.getByTestId('name-2')).toHaveTextContent('Jane Smith');
    });

    it('should display user roles', () => {
      renderUsersTable();
      expect(screen.getByTestId('role-1')).toHaveTextContent('admin');
      expect(screen.getByTestId('role-2')).toHaveTextContent('dungeon-master');
    });

    it('should display NPC counts', () => {
      renderUsersTable();
      expect(screen.getByTestId('monsters-1')).toHaveTextContent('2');
      expect(screen.getByTestId('monsters-2')).toHaveTextContent('0');
    });

    it('should display results count', () => {
      renderUsersTable();
      expect(screen.getByTestId('results-count')).toHaveTextContent('2 results');
    });
  });

  describe('column headers', () => {
    it('should display User column header', () => {
      renderUsersTable();
      expect(screen.getByTestId('header-name')).toHaveTextContent('User');
    });

    it('should display Role column header', () => {
      renderUsersTable();
      expect(screen.getByTestId('header-role')).toHaveTextContent('Role');
    });

    it('should display NPCs column header', () => {
      renderUsersTable();
      expect(screen.getByTestId('header-monsters')).toHaveTextContent('NPCs');
    });

    it('should display Created column header', () => {
      renderUsersTable();
      expect(screen.getByTestId('header-createdAt')).toHaveTextContent('Created');
    });

    it('should display Last Login column header', () => {
      renderUsersTable();
      expect(screen.getByTestId('header-lastSignInAt')).toHaveTextContent('Last Login');
    });
  });

  describe('date formatting', () => {
    it('should format createdAt date correctly', () => {
      renderUsersTable();
      // Jan 15, 2024 format
      expect(screen.getByTestId('createdAt-1')).toHaveTextContent('Jan 15, 2024');
    });

    it('should format lastSignInAt date correctly', () => {
      renderUsersTable();
      // Dec 20, 2024 format
      expect(screen.getByTestId('lastSignInAt-1')).toHaveTextContent('Dec 20, 2024');
    });

    it('should display dash for missing lastSignInAt', () => {
      renderUsersTable();
      expect(screen.getByTestId('lastSignInAt-2')).toHaveTextContent('-');
    });

    it('should format June date correctly', () => {
      renderUsersTable();
      // Jun 1, 2024 format
      expect(screen.getByTestId('createdAt-2')).toHaveTextContent('Jun 1, 2024');
    });
  });

  describe('search functionality', () => {
    it('should have a search input', () => {
      renderUsersTable();
      expect(screen.getByTestId('search-input')).toBeInTheDocument();
    });

    it('should call getUsers with search term when input changes', () => {
      renderUsersTable();

      const searchInput = screen.getByTestId('search-input');
      fireEvent.change(searchInput, { target: { value: 'John' } });

      expect(mockGetUsers).toHaveBeenCalledWith('John');
    });
  });

  describe('empty state', () => {
    it('should handle empty users list', () => {
      renderUsersTable([]);

      expect(screen.getByTestId('results-count')).toHaveTextContent('0 results');
      expect(screen.queryByTestId('row-1')).not.toBeInTheDocument();
    });
  });

  describe('initial load', () => {
    it('should call getUsers on mount', () => {
      renderUsersTable();
      expect(mockGetUsers).toHaveBeenCalled();
    });
  });
});
