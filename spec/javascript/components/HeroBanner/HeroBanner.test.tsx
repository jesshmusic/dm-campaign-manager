import React from 'react';
import { render, screen } from '@testing-library/react';
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

  it('has hero banner class', () => {
    const { container } = render(<HeroBanner />);
    expect(container.querySelector('[class*="heroBanner"]')).toBeInTheDocument();
  });

  it('has title class', () => {
    const { container } = render(<HeroBanner />);
    expect(container.querySelector('[class*="title"]')).toBeInTheDocument();
  });

  it('passes logo class to DMLogo', () => {
    const { container } = render(<HeroBanner />);
    const logo = container.querySelector('[class*="logo"]');
    expect(logo).toBeInTheDocument();
  });
});
