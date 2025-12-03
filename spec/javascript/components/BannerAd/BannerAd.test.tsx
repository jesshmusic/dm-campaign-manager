import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import BannerAd from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/BannerAd/BannerAd';

// Mock React GA
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  event: jest.fn(),
}));

describe('BannerAd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<BannerAd />);
  });

  it('renders banner ad container', () => {
    const { container } = render(<BannerAd />);
    // Styled-components use hashed class names, check container exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders link to Fantasy Grounds', () => {
    const { container } = render(<BannerAd />);
    const link = container.querySelector('a[href*="fantasygrounds.com"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
  });

  it('renders multiple images', () => {
    const { container } = render(<BannerAd />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBeGreaterThan(0);
  });

  it('tracks GA event on click', () => {
    const ReactGA = require('react-ga4');
    const { container } = render(<BannerAd />);
    const link = container.querySelector('a')!;

    fireEvent.click(link);

    expect(ReactGA.event).toHaveBeenCalledWith('Banner Ad Clicked');
  });

  it('has text decoration none on link', () => {
    const { container } = render(<BannerAd />);
    const link = container.querySelector('a')!;
    expect(link).toHaveStyle({ textDecoration: 'none' });
  });
});
