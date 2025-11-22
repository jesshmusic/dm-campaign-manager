import React from 'react';
import { render, screen } from '@testing-library/react';
import MonsterBlock, { AbilityScores } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monsters/MonsterBlock';

jest.mock('react-markdown', () => {
  return function MockReactMarkdown({ children }: any) {
    return <div>{children}</div>;
  };
});

jest.mock('react-icons/all', () => ({
  GiBeerStein: () => <span>Beer</span>,
}));

jest.mock('../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/Button/Button', () => {
  return function MockButton({ title }: any) {
    return <button>{title}</button>;
  };
});

const mockMonster = {
  name: 'Goblin',
  size: 'Small',
  type: 'humanoid',
  alignment: 'Neutral Evil',
  armorClass: 15,
  hitPoints: 7,
  hitPointsString: '7 (2d6)',
  hitDice: '2d6',
  speed: '30 ft',
  speeds: ['30 ft'],
  strength: 8,
  dexterity: 14,
  constitution: 10,
  intelligence: 10,
  wisdom: 8,
  charisma: 8,
  challengeRating: '1/4',
  xp: 50,
  conditionImmunities: [],
  damageImmunities: [],
  damageResistances: [],
  damageVulnerabilities: [],
  savingThrows: [],
  skills: [],
  senses: [],
  languages: [],
  specialAbilities: [],
  actions: [],
  reactions: [],
  legendaryActions: [],
};

describe('MonsterBlock', () => {
  it('renders without crashing', () => {
    render(<MonsterBlock monster={mockMonster as any} />);
  });

  it('displays monster name', () => {
    render(<MonsterBlock monster={mockMonster as any} />);
    expect(screen.getByText('Goblin')).toBeInTheDocument();
  });

  it('displays monster size and type', () => {
    render(<MonsterBlock monster={mockMonster as any} />);
    expect(screen.getByText(/Small humanoid/)).toBeInTheDocument();
  });

  it('displays armor class', () => {
    render(<MonsterBlock monster={mockMonster as any} />);
    expect(screen.getByText(/Armor Class/)).toBeInTheDocument();
    expect(screen.getByText(/15/)).toBeInTheDocument();
  });

  it('displays hit points', () => {
    render(<MonsterBlock monster={mockMonster as any} />);
    expect(screen.getByText(/Hit Points/)).toBeInTheDocument();
    expect(screen.getByText(/7/)).toBeInTheDocument();
  });

  it('displays speed', () => {
    render(<MonsterBlock monster={mockMonster as any} />);
    expect(screen.getByText(/Speed/)).toBeInTheDocument();
    expect(screen.getByText(/30 ft/)).toBeInTheDocument();
  });
});

describe('AbilityScores', () => {
  it('renders without crashing', () => {
    render(<AbilityScores monster={mockMonster as any} />);
  });

  it('displays all six ability scores', () => {
    render(<AbilityScores monster={mockMonster as any} />);
    expect(screen.getByText('STR')).toBeInTheDocument();
    expect(screen.getByText('DEX')).toBeInTheDocument();
    expect(screen.getByText('CON')).toBeInTheDocument();
    expect(screen.getByText('INT')).toBeInTheDocument();
    expect(screen.getByText('WIS')).toBeInTheDocument();
    expect(screen.getByText('CHA')).toBeInTheDocument();
  });

  it('displays ability score values', () => {
    render(<AbilityScores monster={mockMonster as any} />);
    expect(screen.getByText(/8/)).toBeInTheDocument();
    expect(screen.getByText(/14/)).toBeInTheDocument();
    expect(screen.getByText(/10/)).toBeInTheDocument();
  });
});
