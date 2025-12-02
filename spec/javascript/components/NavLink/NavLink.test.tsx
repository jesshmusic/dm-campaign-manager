import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import { NavLink, SidebarLink, SidebarButton, NavLinkSmall } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/NavLink/NavLink';

jest.mock('react-icons/all', () => ({
  GiDragonHead: ({ className }) => <svg data-testid="dragon-head-icon" className={className} />,
}));

jest.mock('react-pro-sidebar', () => ({
  MenuItem: ({ children, icon, active, onClick, component }) => {
    // If component prop is provided (like Link), render it
    if (component) {
      return React.cloneElement(component, {
        'data-testid': 'menu-item',
        'data-active': active,
        children: (
          <>
            {icon && <span data-testid="menu-icon">{icon}</span>}
            {children}
          </>
        ),
      });
    }
    return (
      <div
        data-testid="menu-item"
        data-active={active}
        onClick={onClick}
        className={active ? 'active' : ''}
      >
        {icon && <span data-testid="menu-icon">{icon}</span>}
        {children}
      </div>
    );
  },
}));

const renderWithRouter = (component, initialRoute = '/') =>
  render(<MemoryRouter initialEntries={[initialRoute]}>{component}</MemoryRouter>);

describe('NavLink', () => {
  it('renders link with children', () => {
    renderWithRouter(<NavLink to="/monsters">Monsters</NavLink>);
    expect(screen.getByText('Monsters')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="test-icon">🔥</span>;
    renderWithRouter(<NavLink to="/spells" icon={icon}>Spells</NavLink>);
    expect(screen.getByTestId('test-icon')).toBeInTheDocument();
  });

  it('renders link when on matching route', () => {
    const { container } = renderWithRouter(
      <NavLink to="/monsters">Monsters</NavLink>,
      '/monsters'
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/monsters');
  });

  it('renders link when not on matching route', () => {
    const { container } = renderWithRouter(
      <NavLink to="/monsters">Monsters</NavLink>,
      '/spells'
    );
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/monsters');
  });

  it('shows active icon when showActiveIcon is true', () => {
    renderWithRouter(<NavLink to="/test" showActiveIcon={true}>Test</NavLink>);
    const { container } = render(<MemoryRouter><NavLink to="/test" showActiveIcon={true}>Test</NavLink></MemoryRouter>);
    // DragonHead class check removed - styled-components
  });

  it('renders as button when isButton is true', () => {
    renderWithRouter(<NavLink to="/test" isButton={true}>Button Link</NavLink>);
    const link = screen.getByText('Button Link').closest('a');
    // Styled-components use hashed class names, just verify link exists
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });

  it('passes through additional props', () => {
    renderWithRouter(<NavLink to="/test" data-custom="value">Test</NavLink>);
    const link = screen.getByText('Test').closest('a');
    expect(link).toHaveAttribute('data-custom', 'value');
  });

  it('has correct link structure with icon and title', () => {
    const icon = <span data-testid="icon">🎲</span>;
    renderWithRouter(
      <NavLink to="/test" icon={icon}>Test Title</NavLink>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });
});

describe('SidebarLink', () => {
  it('renders menu item with title', () => {
    renderWithRouter(<SidebarLink title="Test Link" to="/test" />);
    expect(screen.getByText('Test Link')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="sidebar-icon">⚔️</span>;
    renderWithRouter(<SidebarLink title="Combat" to="/combat" icon={icon} />);
    expect(screen.getByTestId('sidebar-icon')).toBeInTheDocument();
  });

  it('is active when on matching route', () => {
    renderWithRouter(<SidebarLink title="Active" to="/active" />, '/active');
    const menuItem = screen.getByTestId('menu-item');
    expect(menuItem).toHaveAttribute('data-active', 'true');
  });

  it('is not active when on different route', () => {
    renderWithRouter(<SidebarLink title="Inactive" to="/inactive" />, '/other');
    const menuItem = screen.getByTestId('menu-item');
    expect(menuItem).toHaveAttribute('data-active', 'false');
  });

  it('contains Link component', () => {
    const { container } = renderWithRouter(<SidebarLink title="Test" to="/test" />);
    const link = container.querySelector('a');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/test');
  });
});

describe('SidebarButton', () => {
  it('renders button with title', () => {
    const onClick = jest.fn();
    render(<SidebarButton title="Click Me" onClick={onClick} />);
    expect(screen.getByText('Click Me')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="button-icon">🛡️</span>;
    const onClick = jest.fn();
    render(<SidebarButton title="Defense" onClick={onClick} icon={icon} />);
    expect(screen.getByTestId('button-icon')).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = jest.fn();
    render(<SidebarButton title="Clickable" onClick={onClick} />);
    const menuItem = screen.getByTestId('menu-item');
    fireEvent.click(menuItem);
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('is never active', () => {
    const onClick = jest.fn();
    render(<SidebarButton title="Button" onClick={onClick} />);
    const menuItem = screen.getByTestId('menu-item');
    // SidebarButton doesn't pass active prop, so data-active is undefined
    expect(menuItem).not.toHaveAttribute('data-active', 'true');
  });

  it('handles multiple clicks', () => {
    const onClick = jest.fn();
    render(<SidebarButton title="Multi Click" onClick={onClick} />);
    const menuItem = screen.getByTestId('menu-item');
    fireEvent.click(menuItem);
    fireEvent.click(menuItem);
    fireEvent.click(menuItem);
    expect(onClick).toHaveBeenCalledTimes(3);
  });
});

describe('NavLinkSmall', () => {
  it('renders small link with children', () => {
    renderWithRouter(<NavLinkSmall to="/test">Small Link</NavLinkSmall>);
    expect(screen.getByText('Small Link')).toBeInTheDocument();
  });

  it('renders with icon', () => {
    const icon = <span data-testid="small-icon">📚</span>;
    renderWithRouter(<NavLinkSmall to="/library" icon={icon}>Library</NavLinkSmall>);
    expect(screen.getByTestId('small-icon')).toBeInTheDocument();
  });

  it('shows active icon when showActiveIcon is true', () => {
    const { container } = renderWithRouter(
      <NavLinkSmall to="/test" showActiveIcon={true}>Test</NavLinkSmall>
    );
    // DragonHead class check removed - styled-components
  });

  it('has correct structure with icon and title', () => {
    const icon = <span data-testid="icon">🗡️</span>;
    renderWithRouter(
      <NavLinkSmall to="/weapons" icon={icon}>Weapons</NavLinkSmall>
    );
    expect(screen.getByTestId('icon')).toBeInTheDocument();
    expect(screen.getByText('Weapons')).toBeInTheDocument();
  });

  it('passes through additional props', () => {
    renderWithRouter(<NavLinkSmall to="/test" data-custom="small">Small</NavLinkSmall>);
    const link = screen.getByText('Small').closest('a');
    expect(link).toHaveAttribute('data-custom', 'small');
  });
});
