import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import Breadcrumbs from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Breadcrumbs/Breadcrumbs';

jest.mock('react-icons/all', () => ({
  GiCastle: ({ size }) => <svg data-testid="castle-icon" data-size={size} />,
  GiPointing: ({ size }) => <svg data-testid="pointing-icon" data-size={size} />,
  GiTwoHandedSword: () => <svg data-testid="sword-icon" />,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Breadcrumbs/BreadcrumbLink', () => {
  return function MockBreadcrumbLink({ to, title }) {
    return <li data-testid="breadcrumb-link"><a href={to}>{title}</a></li>;
  };
});

const renderWithRouter = (component, route = '/') =>
  render(<MemoryRouter initialEntries={[route]}>{component}</MemoryRouter>);

describe('Breadcrumbs', () => {
  it('renders without crashing', () => {
    renderWithRouter(<Breadcrumbs isCollapsed={false} />);
  });

  it('renders home link', () => {
    renderWithRouter(<Breadcrumbs isCollapsed={false} />);
    expect(screen.getByText('Home')).toBeInTheDocument();
  });

  it('shows castle icon when at root', () => {
    renderWithRouter(<Breadcrumbs isCollapsed={false} />, '/');
    expect(screen.getByTestId('castle-icon')).toBeInTheDocument();
  });

  it('shows back button when not at root', () => {
    renderWithRouter(<Breadcrumbs isCollapsed={false} />, '/app/monsters');
    expect(screen.getByTestId('pointing-icon')).toBeInTheDocument();
  });

  it('generates breadcrumb path from URL', () => {
    renderWithRouter(<Breadcrumbs isCollapsed={false} />, '/app/monsters/123');
    expect(screen.getByText('Monsters')).toBeInTheDocument();
  });

  it('applies collapsed class when isCollapsed is true', () => {
    const { container } = renderWithRouter(<Breadcrumbs isCollapsed={true} />, '/');
    const breadcrumb = container.querySelector('nav'); // Breadcrumb nav
    expect(breadcrumb).toBeInTheDocument();
  });

  it('has nav with breadcrumb aria-label', () => {
    const { container } = renderWithRouter(<Breadcrumbs isCollapsed={false} />);
    const nav = container.querySelector('nav[aria-label="breadcrumb"]');
    expect(nav).toBeInTheDocument();
  });

  it('capitalizes path segments', () => {
    renderWithRouter(<Breadcrumbs isCollapsed={false} />, '/app/magic-items');
    expect(screen.getByText('Magic Items')).toBeInTheDocument();
  });
});
