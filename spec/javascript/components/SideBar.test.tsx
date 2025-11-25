import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import configureStore from 'redux-mock-store';
import SideBar from '../../../app/javascript/bundles/DungeonMasterCampaignManager/components/SideBar/SideBar';
import { useAuth0 } from '@auth0/auth0-react';

// Mock the API to prevent async action errors
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/api/api', () => ({
  __esModule: true,
  default: {
    actions: {
      logout: jest.fn(() => ({ type: 'LOGOUT' })),
      getRules: jest.fn(() => ({ type: 'GET_RULES' })),
    },
  },
}));

// Mock Auth0
jest.mock('@auth0/auth0-react');
const mockUseAuth0 = useAuth0 as jest.MockedFunction<typeof useAuth0>;

// Mock react-pro-sidebar components
jest.mock('react-pro-sidebar', () => ({
  ProSidebar: ({ children, collapsed, image }: any) => (
    <div data-testid="pro-sidebar" data-collapsed={collapsed} data-image={image}>
      {children}
    </div>
  ),
  SidebarContent: ({ children }: any) => <div data-testid="sidebar-content">{children}</div>,
  SidebarFooter: ({ children }: any) => <div data-testid="sidebar-footer">{children}</div>,
  Menu: ({ children, iconShape }: any) => <div data-testid="menu" data-icon-shape={iconShape}>{children}</div>,
  MenuItem: ({ children, icon }: any) => <div data-testid="menu-item">{icon}{children}</div>,
  SubMenu: ({ children, title, icon }: any) => (
    <div data-testid="submenu" data-title={title}>
      {icon}{title}{children}
    </div>
  ),
}));

// Mock NavLink components
jest.mock('../../../app/javascript/bundles/DungeonMasterCampaignManager/components/NavLink/NavLink', () => ({
  SidebarButton: ({ onClick, title, icon }: any) => (
    <button data-testid="sidebar-button" onClick={onClick}>
      {icon}{title}
    </button>
  ),
  SidebarLink: ({ to, title, icon }: any) => (
    <a data-testid="sidebar-link" href={to}>
      {icon}{title}
    </a>
  ),
}));

const mockStore = configureStore([]);

describe('SideBar Component', () => {
  let store: any;
  let mockGetAccessTokenSilently: jest.Mock;
  let mockLoginWithRedirect: jest.Mock;
  let mockLogout: jest.Mock;
  let mockSetIsCollapsed: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();

    mockGetAccessTokenSilently = jest.fn().mockResolvedValue('mock-token');
    mockLoginWithRedirect = jest.fn();
    mockLogout = jest.fn();
    mockSetIsCollapsed = jest.fn();

    store = mockStore({
      rules: {
        rules: [
          {
            name: 'Combat',
            slug: 'combat',
            rules: [
              { name: 'Initiative', slug: 'initiative' },
              { name: 'Attack Rolls', slug: 'attack-rolls' },
            ],
          },
          {
            name: 'Spellcasting',
            slug: 'spellcasting',
          },
        ],
      },
      users: {
        currentUser: null,
      },
    });
  });

  describe('rendering', () => {
    it('should render sidebar with all main navigation links', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('pro-sidebar')).toBeInTheDocument();
      expect(screen.getAllByTestId('sidebar-link').length).toBeGreaterThan(0);
    });

    it('should show collapse/expand button when not mobile', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByTestId('sidebar-button')).toBeInTheDocument();
    });

    it('should not show collapse/expand button on mobile', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={true}
              setIsCollapsed={mockSetIsCollapsed}
              getRules={jest.fn()}
              logOutUser={jest.fn()}
              rules={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.queryByTestId('sidebar-button')).not.toBeInTheDocument();
    });

    it('should render rules submenu with nested rules', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      const rules = [
        {
          name: 'Combat',
          slug: 'combat',
          rules: [
            { name: 'Initiative', slug: 'initiative' },
          ],
        },
      ];

      const storeWithRules = mockStore({
        rules: { rules },
        users: { currentUser: null },
      });

      render(
        <Provider store={storeWithRules}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      const submenus = screen.getAllByTestId('submenu');
      expect(submenus.length).toBeGreaterThan(0);
    });

    it('should render items & equipment submenu', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Items & Equipment')).toBeInTheDocument();
    });
  });

  describe('collapsed state', () => {
    it('should pass collapsed prop to ProSidebar', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={true}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
              getRules={jest.fn()}
              logOutUser={jest.fn()}
              rules={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      const sidebar = screen.getByTestId('pro-sidebar');
      expect(sidebar).toHaveAttribute('data-collapsed', 'true');
    });

    it('should toggle collapsed state when collapse button is clicked', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      const collapseButton = screen.getByTestId('sidebar-button');
      fireEvent.click(collapseButton);

      expect(mockSetIsCollapsed).toHaveBeenCalledWith(true);
    });
  });

  describe('authentication states', () => {
    it('should show login button when user is not authenticated', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Log In')).toBeInTheDocument();
    });

    it('should show user name and logout button when authenticated', () => {
      mockUseAuth0.mockReturnValue({
        user: { given_name: 'John', email: 'john@example.com' },
        isAuthenticated: true,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText(/Welcome, John/)).toBeInTheDocument();
      expect(screen.getByText('Log Out')).toBeInTheDocument();
    });

    it('should show admin link for admin users', () => {
      mockUseAuth0.mockReturnValue({
        user: { given_name: 'Admin', email: 'admin@example.com' },
        isAuthenticated: true,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      const adminStore = mockStore({
        rules: { rules: [] },
        users: {
          currentUser: { role: 'admin', name: 'Admin User' },
        },
      });

      render(
        <Provider store={adminStore}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    it('should not show admin link for non-admin users', () => {
      mockUseAuth0.mockReturnValue({
        user: { given_name: 'User', email: 'user@example.com' },
        isAuthenticated: true,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      const userStore = mockStore({
        rules: { rules: [] },
        users: {
          currentUser: { role: 'user', name: 'Regular User' },
        },
      });

      render(
        <Provider store={userStore}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
    });

    it('should show user dashboard link when authenticated', () => {
      mockUseAuth0.mockReturnValue({
        user: { given_name: 'User', email: 'user@example.com' },
        isAuthenticated: true,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('User Dashboard')).toBeInTheDocument();
    });
  });

  describe('user interactions', () => {
    it('should call loginWithRedirect when login button is clicked', () => {
      mockUseAuth0.mockReturnValue({
        user: null,
        isAuthenticated: false,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      const loginButton = screen.getByText('Log In').closest('button');
      if (loginButton) {
        fireEvent.click(loginButton);
        expect(mockLoginWithRedirect).toHaveBeenCalled();
      }
    });

    it('should call logout handler when logout button is clicked', async () => {
      const mockLogOutUser = jest.fn();

      mockUseAuth0.mockReturnValue({
        user: { given_name: 'John', email: 'john@example.com' },
        isAuthenticated: true,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      render(
        <Provider store={store}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
              getRules={jest.fn()}
              logOutUser={mockLogOutUser}
              rules={[]}
            />
          </MemoryRouter>
        </Provider>
      );

      const logoutButton = screen.getByText('Log Out').closest('button');
      if (logoutButton) {
        fireEvent.click(logoutButton);

        await new Promise(resolve => setTimeout(resolve, 0));

        expect(mockGetAccessTokenSilently).toHaveBeenCalled();
      }
    });
  });

  describe('role display', () => {
    it('should display user role when currentUser has role', () => {
      mockUseAuth0.mockReturnValue({
        user: { given_name: 'Admin', email: 'admin@example.com' },
        isAuthenticated: true,
        getAccessTokenSilently: mockGetAccessTokenSilently,
        loginWithRedirect: mockLoginWithRedirect,
        logout: mockLogout,
      } as any);

      const adminStore = mockStore({
        rules: { rules: [] },
        users: {
          currentUser: { role: 'admin', name: 'Admin User' },
        },
      });

      render(
        <Provider store={adminStore}>
          <MemoryRouter>
            <SideBar
              isCollapsed={false}
              isMobile={false}
              setIsCollapsed={mockSetIsCollapsed}
            />
          </MemoryRouter>
        </Provider>
      );

      expect(screen.getByText('admin')).toBeInTheDocument();
    });
  });
});
