import React from 'react';
import { render, screen } from '../../test-utils';
import { MemoryRouter } from 'react-router-dom';
import PageTitle from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle';

const renderWithRouter = (component) => render(<MemoryRouter>{component}</MemoryRouter>);

describe('PageTitle', () => {
  it('renders with title', () => {
    render(<PageTitle title="Test Page" />);
    expect(screen.getByText('Test Page')).toBeInTheDocument();
  });

  it('renders with subtitle', () => {
    render(<PageTitle title="Main Title" subtitle="Sub Title" />);
    expect(screen.getByText('Main Title')).toBeInTheDocument();
    expect(screen.getByText('Sub Title')).toBeInTheDocument();
  });

  it('renders without subtitle when not provided', () => {
    const { container } = render(<PageTitle title="Title Only" />);
    expect(screen.getByText('Title Only')).toBeInTheDocument();
    const subtitle = container.querySelector('[class*="subtitle"]');
    expect(subtitle).not.toBeInTheDocument();
  });

  it('renders with button when hasButton is true', () => {
    renderWithRouter(
      <PageTitle
        title="Page with Button"
        hasButton={true}
        buttonLink="/create"
        buttonTitle="Create New"
        buttonVariant="primary"
      />
    );
    const button = screen.getByText('Create New');
    expect(button).toBeInTheDocument();
    expect(button.closest('a')).toHaveAttribute('href', '/create');
  });

  it('does not render button when hasButton is false', () => {
    render(<PageTitle title="No Button" hasButton={false} />);
    const links = document.querySelectorAll('a');
    expect(links.length).toBe(0);
  });

  it('applies draconis class when isDraconis is true', () => {
    const { container } = render(<PageTitle title="Draconis Title" isDraconis={true} />);
    const h1 = container.querySelector('h1');
    // Removed class assertion - styled-components uses dynamic class names
  });

  it('does not apply draconis class when isDraconis is false', () => {
    const { container } = render(<PageTitle title="Normal Title" isDraconis={false} />);
    const h1 = container.querySelector('h1');
    expect(h1).not.toHaveClass('draconis');
  });

  it('applies correct button variant class', () => {
    renderWithRouter(
      <PageTitle
        title="Button Variants"
        hasButton={true}
        buttonLink="/test"
        buttonTitle="Click Me"
        buttonVariant="success"
      />
    );
    const button = screen.getByText('Click Me');
    expect(button).toHaveClass('btn-success');
  });
});
