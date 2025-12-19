import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import EnvironmentalEffectsWidget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/EnvironmentalEffectsWidget';

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Frame/Frame',
  () => {
    return function MockFrame({ title, subtitle, children }: any) {
      return (
        <div data-testid="frame">
          <h2>{title}</h2>
          <p>{subtitle}</p>
          {children}
        </div>
      );
    };
  }
);

describe('EnvironmentalEffectsWidget', () => {
  it('renders without crashing', () => {
    render(<EnvironmentalEffectsWidget />);
  });

  it('renders with frame by default', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('Environmental Effects')).toBeInTheDocument();
  });

  it('renders without frame when hideFrame is true', () => {
    render(<EnvironmentalEffectsWidget hideFrame={true} />);
    expect(screen.queryByTestId('frame')).not.toBeInTheDocument();
  });

  it('displays quick reference items for all effects', () => {
    render(<EnvironmentalEffectsWidget />);
    const effects = [
      'deep-water',
      'extreme-cold',
      'extreme-heat',
      'frigid-water',
      'heavy-precipitation',
      'high-altitude',
      'slippery-ice',
      'strong-wind',
      'thin-ice',
    ];

    effects.forEach((effect) => {
      expect(screen.getByTestId(`quick-ref-${effect}`)).toBeInTheDocument();
    });
  });

  it('displays effect card with description', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByTestId('effect-card')).toBeInTheDocument();
    // Use getAllByText since "Deep Water" appears in dropdown, card title, and quick ref
    expect(screen.getAllByText('Deep Water').length).toBeGreaterThan(0);
    expect(screen.getByText(/Swimming through deep water/)).toBeInTheDocument();
  });

  it('updates effect card when quick reference item is clicked', () => {
    render(<EnvironmentalEffectsWidget />);
    const extremeColdButton = screen.getByTestId('quick-ref-extreme-cold');

    fireEvent.click(extremeColdButton);

    // Verify the card shows Extreme Cold content
    expect(screen.getByText(/0 degrees Fahrenheit/)).toBeInTheDocument();
  });

  it('displays quick reference list with all effects', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByTestId('quick-ref-deep-water')).toBeInTheDocument();
    expect(screen.getByTestId('quick-ref-extreme-cold')).toBeInTheDocument();
    expect(screen.getByTestId('quick-ref-thin-ice')).toBeInTheDocument();
  });

  it('changes effect when quick reference item is clicked', () => {
    render(<EnvironmentalEffectsWidget />);

    const strongWindButton = screen.getByTestId('quick-ref-strong-wind');
    fireEvent.click(strongWindButton);

    expect(screen.getByText(/ranged attack rolls/)).toBeInTheDocument();
  });

  it('shows DC information in effect description', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByText(/DC 10 Constitution saving throw/)).toBeInTheDocument();
  });
});
