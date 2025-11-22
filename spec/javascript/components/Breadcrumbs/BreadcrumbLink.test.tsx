import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import BreadcrumbLink from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Breadcrumbs/BreadcrumbLink';

jest.mock('react-icons/all', () => ({
  GiTwoHandedSword: () => <svg data-testid="sword-icon" />,
}));

const renderWithRouter = (component) => {
  return render(<MemoryRouter>{component}</MemoryRouter>);
};

describe('BreadcrumbLink', () => {
  it('renders without crashing', () => {
    renderWithRouter(<BreadcrumbLink to="/test" title="Test" />);
  });

  it('renders the title text', () => {
    renderWithRouter(<BreadcrumbLink to="/monsters" title="Monsters" />);
    expect(screen.getByText('Monsters')).toBeInTheDocument();
  });

  it('creates a link with correct path', () => {
    renderWithRouter(<BreadcrumbLink to="/spells" title="Spells" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/spells');
  });

  it('renders sword icon for non-root paths', () => {
    const { container } = renderWithRouter(<BreadcrumbLink to="/items" title="Items" />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('does not render sword icon for root path', () => {
    const { container } = renderWithRouter(<BreadcrumbLink to="/" title="Home" />);
    const svg = container.querySelector('svg');
    expect(svg).not.toBeInTheDocument();
  });

  it('has breadcrumbItem class', () => {
    const { container } = renderWithRouter(<BreadcrumbLink to="/test" title="Test" />);
    const listItem = container.querySelector('li');
    expect(listItem).toHaveClass('breadcrumbItem');
  });

  it('renders as a list item', () => {
    const { container } = renderWithRouter(<BreadcrumbLink to="/test" title="Test" />);
    const listItem = container.querySelector('li');
    expect(listItem).toBeInTheDocument();
  });

  it('handles paths with parameters', () => {
    renderWithRouter(<BreadcrumbLink to="/monsters/123" title="Dragon" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/monsters/123');
  });

  it('handles query strings', () => {
    renderWithRouter(<BreadcrumbLink to="/search?q=fireball" title="Search Results" />);
    const link = screen.getByRole('link');
    expect(link).toHaveAttribute('href', '/search?q=fireball');
  });
});
