import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import TravelCalculatorWidget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/TravelCalculatorWidget';

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

describe('TravelCalculatorWidget', () => {
  it('renders without crashing', () => {
    render(<TravelCalculatorWidget />);
  });

  it('renders with frame by default', () => {
    render(<TravelCalculatorWidget />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('Travel Calculator')).toBeInTheDocument();
  });

  it('renders without frame when hideFrame is true', () => {
    render(<TravelCalculatorWidget hideFrame={true} />);
    expect(screen.queryByTestId('frame')).not.toBeInTheDocument();
  });

  it('displays terrain selector', () => {
    render(<TravelCalculatorWidget />);
    expect(screen.getByLabelText('Select Terrain')).toBeInTheDocument();
  });

  it('shows all terrain options', () => {
    render(<TravelCalculatorWidget />);
    const select = screen.getByLabelText('Select Terrain');
    expect(select).toBeInTheDocument();

    const terrains = [
      'Arctic',
      'Coastal',
      'Desert',
      'Forest',
      'Grassland',
      'Hill',
      'Mountain',
      'Swamp',
      'Underdark',
      'Urban',
      'Waterborne',
    ];

    terrains.forEach((terrain) => {
      expect(screen.getByRole('option', { name: terrain })).toBeInTheDocument();
    });
  });

  it('displays stats for selected terrain', () => {
    render(<TravelCalculatorWidget />);
    expect(screen.getByText('Max Pace')).toBeInTheDocument();
    // "Fast" appears in both the stat box and the table
    expect(screen.getAllByText('Fast').length).toBeGreaterThan(0);
    expect(screen.getByText('Foraging DC')).toBeInTheDocument();
    // "20" appears multiple times in the table
    expect(screen.getAllByText('20').length).toBeGreaterThan(0);
  });

  it('updates display when terrain is changed', () => {
    render(<TravelCalculatorWidget />);
    const select = screen.getByLabelText('Select Terrain');

    fireEvent.change(select, { target: { value: 'Mountain' } });

    // "Slow" appears in stat box and table
    expect(screen.getAllByText('Slow').length).toBeGreaterThan(0);
  });

  it('displays terrain stats', () => {
    render(<TravelCalculatorWidget />);
    expect(screen.getByText('Max Pace')).toBeInTheDocument();
    expect(screen.getByText('Encounter Dist.')).toBeInTheDocument();
    expect(screen.getByText('Foraging DC')).toBeInTheDocument();
    expect(screen.getByText('Navigation DC')).toBeInTheDocument();
    expect(screen.getByText('Search DC')).toBeInTheDocument();
  });

  it('shows pace note for Arctic terrain', () => {
    render(<TravelCalculatorWidget />);
    expect(screen.getByText(/Appropriate equipment/)).toBeInTheDocument();
  });
});
