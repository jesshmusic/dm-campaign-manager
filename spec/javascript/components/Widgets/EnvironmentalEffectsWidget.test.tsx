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

  it('displays effect selector', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByTestId('effect-select')).toBeInTheDocument();
  });

  it('shows all environmental effects in dropdown', () => {
    render(<EnvironmentalEffectsWidget />);
    const effects = [
      'Deep Water',
      'Extreme Cold',
      'Extreme Heat',
      'Frigid Water',
      'Heavy Precipitation',
      'High Altitude',
      'Slippery Ice',
      'Strong Wind',
      'Thin Ice',
    ];

    effects.forEach((effect) => {
      expect(screen.getByRole('option', { name: effect })).toBeInTheDocument();
    });
  });

  it('displays effect card with description', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByTestId('effect-card')).toBeInTheDocument();
    // Use getAllByText since "Deep Water" appears in dropdown, card title, and quick ref
    expect(screen.getAllByText('Deep Water').length).toBeGreaterThan(0);
    expect(screen.getByText(/Swimming through deep water/)).toBeInTheDocument();
  });

  it('updates effect card when selection changes', () => {
    render(<EnvironmentalEffectsWidget />);
    const select = screen.getByTestId('effect-select');

    fireEvent.change(select, { target: { value: 'Extreme Cold' } });

    // Use getAllByText since it appears in multiple places
    expect(screen.getAllByText('Extreme Cold').length).toBeGreaterThan(0);
    expect(screen.getByText(/0 degrees Fahrenheit/)).toBeInTheDocument();
  });

  it('displays quick reference list', () => {
    render(<EnvironmentalEffectsWidget />);
    expect(screen.getByText('Quick Reference')).toBeInTheDocument();
    expect(screen.getByTestId('quick-ref-deep-water')).toBeInTheDocument();
    expect(screen.getByTestId('quick-ref-extreme-cold')).toBeInTheDocument();
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
