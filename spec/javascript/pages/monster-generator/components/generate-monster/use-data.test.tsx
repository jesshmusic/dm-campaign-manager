import React from 'react';
import { render, screen, waitFor } from '../../../../test-utils';
import {
  useData,
  generateAttackDesc,
} from '../../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/generate-monster/use-data';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Test component wrapper
const TestComponent = (props: any) => {
  const hookData = useData(props);
  return (
    <div>
      <div data-testid="name">{hookData.UseForm.getValues('name')}</div>
      <div data-testid="alignment">{hookData.UseForm.getValues('alignment')}</div>
      <div data-testid="armor-class">{hookData.UseForm.getValues('armorClass')}</div>
      <div data-testid="hit-points">{hookData.UseForm.getValues('hitPoints')}</div>
      <button onClick={() => hookData.handleGenerateMonsterName()}>Generate Monster Name</button>
      <button onClick={() => hookData.handleGenerateName('male', 'elf')}>Generate Fantasy Name</button>
      <button onClick={() => hookData.handleCalculateCR()}>Calculate CR</button>
    </div>
  );
};

describe('generate-monster useData', () => {
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
    expect(screen.getByTestId('armor-class')).toHaveTextContent('10');
    expect(screen.getByTestId('hit-points')).toHaveTextContent('4');
  });

  it('handles generate monster name', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Tiamat' } });

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Monster Name');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/random_monster_name');
    });
  });

  it('handles generate fantasy name', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { name: 'Galadriel' } });

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Fantasy Name');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/v1/random_fantasy_name?random_monster_gender=male&random_monster_race=elf'
      );
    });
  });

  it('defaults to human when race is not provided in generate name', async () => {
    mockedAxios.get.mockResolvedValueOnce({ data: { name: 'John' } });

    // Create a component that calls with null race
    const TestComp = () => {
      const hookData = useData(defaultProps);
      return <button onClick={() => hookData.handleGenerateName('male', null)}>Generate</button>;
    };

    render(<TestComp />);
    const button = screen.getByText('Generate');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.get).toHaveBeenCalledWith(
        '/v1/random_fantasy_name?random_monster_gender=male&random_monster_race=human'
      );
    });
  });

  it('handles calculate CR', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      data: {
        challenge: {
          name: '5',
          data: {
            prof_bonus: 3,
            xp: 1800,
          },
        },
      },
    });

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Calculate CR');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith('/v1/calculate_cr', expect.anything());
    });
  });

  it('handles errors in generate monster name gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Monster Name');
    button.click();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles errors in generate fantasy name gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockedAxios.get.mockRejectedValueOnce(new Error('Network error'));

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Fantasy Name');
    button.click();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles errors in calculate CR gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    mockedAxios.post.mockRejectedValueOnce(new Error('Network error'));

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Calculate CR');
    button.click();

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});

describe('generateAttackDesc', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('generates attack description', async () => {
    const mockActionFields = {
      name: 'Bite',
      actionType: 'attack',
      damage: {
        numDice: 2,
        diceValue: 6,
        damageType: 'piercing',
      },
    } as any;

    mockedAxios.post.mockResolvedValueOnce({
      data: { desc: 'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+3 piercing damage.' },
    });

    const result = await generateAttackDesc('Dire Wolf', mockActionFields, 5, 2, 3);

    expect(mockedAxios.post).toHaveBeenCalledWith('/v1/generate_action_desc', {
      params: expect.objectContaining({
        monster_name: 'Dire Wolf',
        attack_bonus: 5,
        prof_bonus: 2,
        damage_bonus: 3,
      }),
    });

    expect(result).toBe(
      'Melee Weapon Attack: +5 to hit, reach 5 ft., one target. Hit: 2d6+3 piercing damage.'
    );
  });

  it('passes action fields correctly', async () => {
    const mockActionFields = {
      name: 'Claw',
      actionType: 'attack',
      numAttacks: 2,
      damage: {
        numDice: 1,
        diceValue: 8,
        damageType: 'slashing',
      },
    } as any;

    mockedAxios.post.mockResolvedValueOnce({
      data: { desc: 'Melee Weapon Attack: +7 to hit.' },
    });

    await generateAttackDesc('Dragon', mockActionFields, 7, 3, 4);

    // Fields are converted to snake_case
    expect(mockedAxios.post).toHaveBeenCalledWith(
      '/v1/generate_action_desc',
      expect.objectContaining({
        params: expect.objectContaining({
          monster_name: 'Dragon',
          attack_bonus: 7,
          prof_bonus: 3,
          damage_bonus: 4,
        }),
      })
    );
  });
});
