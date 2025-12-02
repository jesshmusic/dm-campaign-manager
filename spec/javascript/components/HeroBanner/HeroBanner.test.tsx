import React from 'react';
import { render, screen } from '../../test-utils';
import HeroBanner from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/HeroBanner/HeroBanner';

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/HeroBanner/DMLogo', () => {
  return function MockDndLogo({ className }) {
    return <div className={className} data-testid="dnd-logo">Logo</div>;
  };
});

describe('HeroBanner', () => {
  it('renders without crashing', () => {
    render(<HeroBanner />);
  });

  it('renders the title text', () => {
    render(<HeroBanner />);
    expect(screen.getByText('Dungeon Master GURU')).toBeInTheDocument();
  });

  it('renders the DMLogo component', () => {
    render(<HeroBanner />);
    expect(screen.getByTestId('dnd-logo')).toBeInTheDocument();
  });

  it('renders the hero banner container', () => {
    const { container } = render(<HeroBanner />);
    // HeroBanner renders with styled-components, check the structure exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders the title element', () => {
    render(<HeroBanner />);
    // Title is rendered as a styled div, not a heading element
    expect(screen.getByText('Dungeon Master GURU')).toBeInTheDocument();
  });

  it('renders the logo with testid', () => {
    render(<HeroBanner />);
    expect(screen.getByTestId('dnd-logo')).toBeInTheDocument();
  });
});
