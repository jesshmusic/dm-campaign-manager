import React from 'react';
import { render, screen } from '@testing-library/react';
import FeaturesDesc from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/FeaturesDesc';

describe('FeaturesDesc', () => {
  const mockClass = {
    name: 'Fighter',
    levels: [
      {
        level: 1,
        features: [
          {
            name: 'Fighting Style',
            desc: ['You adopt a particular style of fighting'],
          },
          {
            name: 'Second Wind',
            desc: ['You can use a bonus action to regain hit points'],
          },
        ],
      },
    ],
    spellCasting: null,
  };

  it('renders without crashing', () => {
    render(<FeaturesDesc dndClass={mockClass as any} />);
  });

  it('displays features', () => {
    render(<FeaturesDesc dndClass={mockClass as any} />);
    expect(screen.getByText('Fighting Style')).toBeInTheDocument();
    expect(screen.getByText('Second Wind')).toBeInTheDocument();
  });

  it('displays feature descriptions', () => {
    render(<FeaturesDesc dndClass={mockClass as any} />);
    expect(
      screen.getByText('You adopt a particular style of fighting')
    ).toBeInTheDocument();
    expect(
      screen.getByText('You can use a bonus action to regain hit points')
    ).toBeInTheDocument();
  });

  it('displays spell casting section when present', () => {
    const mockClassWithSpells = {
      ...mockClass,
      spellCasting: {
        info: [
          {
            name: 'Cantrips',
            desc: ['You know a number of wizard cantrips'],
          },
        ],
      },
    };

    render(<FeaturesDesc dndClass={mockClassWithSpells as any} />);
    expect(screen.getByText('Spell Casting')).toBeInTheDocument();
    expect(screen.getByText('Cantrips')).toBeInTheDocument();
  });

  it('does not display spell casting section when not present', () => {
    render(<FeaturesDesc dndClass={mockClass as any} />);
    expect(screen.queryByText('Spell Casting')).not.toBeInTheDocument();
  });
});
