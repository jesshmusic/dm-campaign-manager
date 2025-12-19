import React from 'react';
import { render, screen, fireEvent } from '../../test-utils';
import EncounterDistanceWidget from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Widgets/EncounterDistanceWidget';

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

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button',
  () => {
    return function MockButton({ children, onClick, title, ...props }: any) {
      return (
        <button onClick={onClick} {...props}>
          {title || children}
        </button>
      );
    };
  }
);

describe('EncounterDistanceWidget', () => {
  it('renders without crashing', () => {
    render(<EncounterDistanceWidget />);
  });

  it('renders with frame by default', () => {
    render(<EncounterDistanceWidget />);
    expect(screen.getByTestId('frame')).toBeInTheDocument();
    expect(screen.getByText('Encounter Distance')).toBeInTheDocument();
  });

  it('renders without frame when hideFrame is true', () => {
    render(<EncounterDistanceWidget hideFrame={true} />);
    expect(screen.queryByTestId('frame')).not.toBeInTheDocument();
  });

  it('displays terrain selector with dice formulas', () => {
    render(<EncounterDistanceWidget />);
    expect(screen.getByLabelText('Select Terrain')).toBeInTheDocument();
    expect(screen.getByRole('option', { name: /Arctic.*6d6/i })).toBeInTheDocument();
  });

  it('shows roll button', () => {
    render(<EncounterDistanceWidget />);
    expect(screen.getByTestId('roll-button')).toBeInTheDocument();
    expect(screen.getByText('Roll Encounter Distance')).toBeInTheDocument();
  });

  it('displays placeholder before rolling', () => {
    render(<EncounterDistanceWidget />);
    expect(screen.getByText('— feet')).toBeInTheDocument();
  });

  it('shows dice formula for selected terrain', () => {
    render(<EncounterDistanceWidget />);
    expect(screen.getByText('6d6 × 10 feet')).toBeInTheDocument();
  });

  it('displays result after rolling', () => {
    render(<EncounterDistanceWidget />);

    const rollButton = screen.getByTestId('roll-button');
    fireEvent.click(rollButton);

    expect(screen.getByTestId('distance-result')).toBeInTheDocument();
    expect(screen.getByTestId('dice-breakdown')).toBeInTheDocument();
  });

  it('clears result when terrain is changed', () => {
    render(<EncounterDistanceWidget />);

    const rollButton = screen.getByTestId('roll-button');
    fireEvent.click(rollButton);

    expect(screen.getByTestId('distance-result')).toBeInTheDocument();

    const select = screen.getByLabelText('Select Terrain');
    fireEvent.change(select, { target: { value: 'Forest' } });

    expect(screen.queryByTestId('dice-breakdown')).not.toBeInTheDocument();
    expect(screen.getByText('— feet')).toBeInTheDocument();
  });

  it('updates dice formula when terrain changes', () => {
    render(<EncounterDistanceWidget />);

    const select = screen.getByLabelText('Select Terrain');
    fireEvent.change(select, { target: { value: 'Forest' } });

    expect(screen.getByText('2d8 × 10 feet')).toBeInTheDocument();
  });
});
