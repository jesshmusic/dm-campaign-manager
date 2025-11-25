import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { useData } from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/quick-generate-monster/use-data';
import axios from 'axios';
import * as services from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/services';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Test component wrapper
const TestComponent = (props: any) => {
  const hookData = useData(props);
  return (
    <div>
      <div data-testid="name">{hookData.UseForm.getValues('name')}</div>
      <div data-testid="alignment">{hookData.UseForm.getValues('alignment')}</div>
      <div data-testid="monster-type">{hookData.monsterType}</div>
      <div data-testid="archetype-options">{JSON.stringify(hookData.archetypeOptions)}</div>
      <div data-testid="cr-options">{JSON.stringify(hookData.challengeRatingOptions)}</div>
      <button onClick={() => hookData.handleGenerateMonsterName()}>Generate Monster Name</button>
      <button onClick={() => hookData.handleGenerateName('male', 'elf')}>Generate Fantasy Name</button>
      <button
        onClick={() => {
          const mockCallback = jest.fn();
          hookData.getMonsterActions('bite', mockCallback);
        }}
      >
        Get Actions
      </button>
      <button
        onClick={() => {
          const mockCallback = jest.fn();
          hookData.getSpecialAbilities('magic', mockCallback);
        }}
      >
        Get Abilities
      </button>
      <button
        onClick={() => {
          const mockCallback = jest.fn();
          hookData.getSpells('fire', mockCallback);
        }}
      >
        Get Spells
      </button>
    </div>
  );
};

describe('quick-generate-monster useData', () => {
  const mockOnGenerateMonster = jest.fn();
  const defaultProps = {
    isLoading: false,
    onGenerateMonster: mockOnGenerateMonster,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes with default form values', () => {
    render(<TestComponent {...defaultProps} />);

    expect(screen.getByTestId('name')).toHaveTextContent('New Monster');
    expect(screen.getByTestId('alignment')).toHaveTextContent('Neutral');
  });

  it('initializes monsterType as humanoid', () => {
    render(<TestComponent {...defaultProps} />);

    expect(screen.getByTestId('monster-type')).toHaveTextContent('humanoid');
  });

  it('returns archetype options', () => {
    render(<TestComponent {...defaultProps} />);

    const archetypeOptions = JSON.parse(screen.getByTestId('archetype-options').textContent || '[]');
    expect(archetypeOptions).toHaveLength(5);
    expect(archetypeOptions[0]).toEqual({ label: 'Any', value: 'any' });
    expect(archetypeOptions[1]).toEqual({ label: 'Cleric', value: 'cleric' });
  });

  it('returns challenge rating options', () => {
    render(<TestComponent {...defaultProps} />);

    const crOptions = JSON.parse(screen.getByTestId('cr-options').textContent || '[]');
    expect(Array.isArray(crOptions)).toBe(true);
    expect(crOptions.length).toBeGreaterThan(0);
  });

  it('handles generate monster name', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Gruumsh' } });

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Monster Name');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/random_monster_name');
    });
  });

  it('handles generate fantasy name', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Legolas' } });

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Fantasy Name');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/v1/random_fantasy_name?random_monster_gender=male&random_monster_race=elf'
      );
    });
  });

  it('handles get actions', async () => {
    const mockActions = {
      data: {
        actions: [
          { name: 'Bite', desc: 'Melee attack' },
          { name: 'Claw', desc: 'Melee attack' },
        ],
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockActions);

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Get Actions');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/actions-by-name.json?action_name=bite');
    });
  });

  it('handles get special abilities', async () => {
    const mockAbilities = {
      data: {
        special_abilities: ['Magic Resistance', 'Pack Tactics'],
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockAbilities);

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Get Abilities');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/special-abilities.json?search=magic');
    });
  });

  it('handles get spells', async () => {
    const mockSpells = {
      data: {
        results: [
          { name: 'Fireball', level: 3 },
          { name: 'Magic Missile', level: 1 },
        ],
      },
    };
    mockedAxios.get.mockResolvedValueOnce(mockSpells);

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Get Spells');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/spells.json?list=true&search=fire}');
    });
  });
});
