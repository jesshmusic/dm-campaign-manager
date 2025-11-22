import React from 'react';
import { render, screen } from '@testing-library/react';
import HitPointsSection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/HitPointsSection';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/InfoBlock/InfoBlock', () => {
  return function MockInfoBlock({ title, desc }: any) {
    return (
      <div data-testid={`info-block-${title}`}>
        <strong>{title}:</strong> {desc}
      </div>
    );
  };
});

describe('HitPointsSection', () => {
  const mockClass = {
    name: 'Fighter',
    hitDie: 10,
  };

  it('renders without crashing', () => {
    render(<HitPointsSection dndClass={mockClass as any} />);
  });

  it('displays Hit Points heading', () => {
    render(<HitPointsSection dndClass={mockClass as any} />);
    expect(screen.getByText('Hit Points')).toBeInTheDocument();
  });

  it('displays Hit Dice info', () => {
    render(<HitPointsSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Hit Dice')).toBeInTheDocument();
    expect(screen.getByText(/1d10 per fighter level/)).toBeInTheDocument();
  });

  it('displays Hit Points at 1st Level', () => {
    render(<HitPointsSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Hit Points at 1st Level')).toBeInTheDocument();
    expect(screen.getByText(/10 \+ your Constitution modifier/)).toBeInTheDocument();
  });

  it('displays Hit Points at Higher Levels', () => {
    render(<HitPointsSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Hit Points at Higher Levels')).toBeInTheDocument();
  });
});
