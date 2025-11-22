import React from 'react';
import { render, screen } from '@testing-library/react';
import ProficienciesSection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/dnd-classes/components/ProficienciesSection';

jest.mock('../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/InfoBlock/InfoBlock', () => {
  return function MockInfoBlock({ title, desc }: any) {
    return (
      <div data-testid={`info-block-${title}`}>
        <strong>{title}:</strong> {desc}
      </div>
    );
  };
});

describe('ProficienciesSection', () => {
  const mockClass = {
    name: 'Fighter',
    proficiencies: [
      { name: 'Light armor', profType: 'Armor' },
      { name: 'Shields', profType: 'Armor' },
      { name: 'Simple weapons', profType: 'Weapons' },
    ],
    abilityScores: [
      { fullName: 'Strength' },
      { fullName: 'Constitution' },
    ],
    proficiencyChoices: [
      {
        numChoices: 2,
        proficiencies: [
          { name: 'Skill: Acrobatics' },
          { name: 'Skill: Athletics' },
        ],
      },
    ],
  };

  it('renders without crashing', () => {
    render(<ProficienciesSection dndClass={mockClass as any} />);
  });

  it('displays Proficiencies heading', () => {
    render(<ProficienciesSection dndClass={mockClass as any} />);
    expect(screen.getByText('Proficiencies')).toBeInTheDocument();
  });

  it('displays Armor proficiencies', () => {
    render(<ProficienciesSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Armor')).toBeInTheDocument();
    expect(screen.getByText(/Light armor, Shields/)).toBeInTheDocument();
  });

  it('displays Weapons proficiencies', () => {
    render(<ProficienciesSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Weapons')).toBeInTheDocument();
    expect(screen.getByText(/Simple weapons/)).toBeInTheDocument();
  });

  it('displays Saving Throws', () => {
    render(<ProficienciesSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Saving Throws')).toBeInTheDocument();
    expect(screen.getByText(/Strength, Constitution/)).toBeInTheDocument();
  });

  it('displays Skills choices', () => {
    render(<ProficienciesSection dndClass={mockClass as any} />);
    expect(screen.getByTestId('info-block-Skills')).toBeInTheDocument();
  });
});
