import React from 'react';
import { render, fireEvent } from '../../test-utils';
import YouTubeAd from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/BannerAd/YouTubeAd';

// Mock React GA
jest.mock('react-ga4', () => ({
  initialize: jest.fn(),
  event: jest.fn(),
}));

describe('YouTubeAd', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<YouTubeAd />);
  });

  it('renders banner ad container', () => {
    const { container } = render(<YouTubeAd />);
    // Styled-components use hashed class names, check container exists
    expect(container.firstChild).toBeInTheDocument();
  });

  it('renders link to YouTube channel', () => {
    const { container } = render(<YouTubeAd />);
    const link = container.querySelector('a[href*="youtube.com"]');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('href', 'https://www.youtube.com/channel/UCC8ZTZ5nMEuVelHXMJpPeCA');
  });

  it('renders two images for responsive display', () => {
    const { container } = render(<YouTubeAd />);
    const images = container.querySelectorAll('img');
    expect(images.length).toBe(2);
  });

  it('tracks GA event on click', () => {
    const ReactGA = require('react-ga4');
    const { container } = render(<YouTubeAd />);
    const link = container.querySelector('a')!;

    fireEvent.click(link);

    expect(ReactGA.event).toHaveBeenCalledWith('YouTube Ad Clicked');
  });

  it('has text decoration none on link', () => {
    const { container } = render(<YouTubeAd />);
    const link = container.querySelector('a')!;
    expect(link).toHaveStyle({ textDecoration: 'none' });
  });

  it('renders images for banner', () => {
    const { container } = render(<YouTubeAd />);
    const images = container.querySelectorAll('img');
    // Styled-components use hashed class names, just verify images exist
    expect(images.length).toBeGreaterThan(0);
  });
});
