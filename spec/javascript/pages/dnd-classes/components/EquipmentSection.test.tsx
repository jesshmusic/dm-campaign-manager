import React from 'react';
import { render, screen } from '../../../test-utils';
import EquipmentSection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/EquipmentSection';

describe('EquipmentSection', () => {
  const mockClass = {
    name: 'Fighter',
    startingEquipmentOptions: [
      {
        options: [
          { name: 'a martial weapon and a shield' },
          { name: 'two martial weapons' },
        ],
      },
    ],
    startingEquipment: [
      { name: 'Chain mail' },
    ],
  };

  it('renders without crashing', () => {
    render(<EquipmentSection dndClass={mockClass as any} />);
  });

  it('displays Equipment heading', () => {
    render(<EquipmentSection dndClass={mockClass as any} />);
    expect(screen.getByText('Equipment')).toBeInTheDocument();
  });

  it('displays starting equipment description', () => {
    render(<EquipmentSection dndClass={mockClass as any} />);
    expect(
      screen.getByText(/You start with the following equipment/)
    ).toBeInTheDocument();
  });

  it('displays equipment options', () => {
    render(<EquipmentSection dndClass={mockClass as any} />);
    expect(screen.getByText(/a martial weapon and a shield/)).toBeInTheDocument();
    expect(screen.getByText(/two martial weapons/)).toBeInTheDocument();
  });

  it('displays starting equipment', () => {
    render(<EquipmentSection dndClass={mockClass as any} />);
    expect(screen.getByText(/Chain mail/)).toBeInTheDocument();
  });
});
