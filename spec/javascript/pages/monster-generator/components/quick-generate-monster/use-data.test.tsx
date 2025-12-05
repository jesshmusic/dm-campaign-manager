import React from 'react';
import { render, screen, waitFor } from '../../../../test-utils';
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
      <div data-testid="is-generating">{hookData.isGeneratingActions.toString()}</div>
      <div data-testid="generated-actions">{JSON.stringify(hookData.generatedActions)}</div>
      <button onClick={() => hookData.handleGenerateMonsterName()}>Generate Monster Name</button>
      <button onClick={() => hookData.handleGenerateName('male', 'elf')}>Generate Fantasy Name</button>
      <button onClick={() => hookData.handleGenerateActions()}>Generate Actions</button>
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

    expect(screen.getByTestId('name')).toHaveTextContent('New NPC');
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
      expect(mockedAxios.get).toHaveBeenCalledWith('/v1/random_monster_name?monster_type=humanoid&size=medium');
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

  it('initializes isGeneratingActions as false', () => {
    render(<TestComponent {...defaultProps} />);

    expect(screen.getByTestId('is-generating')).toHaveTextContent('false');
  });

  it('initializes generatedActions as null', () => {
    render(<TestComponent {...defaultProps} />);

    expect(screen.getByTestId('generated-actions')).toHaveTextContent('null');
  });

  it('handles generate actions API call', async () => {
    const mockResponse = {
      data: {
        actions: [{ name: 'Bite', desc: 'Melee attack' }],
        special_abilities: [{ name: 'Pack Tactics', desc: 'Advantage when ally nearby' }],
        spells: ['Fire Bolt'],
      },
    };
    mockedAxios.post.mockResolvedValueOnce(mockResponse);

    render(<TestComponent {...defaultProps} />);

    const button = screen.getByText('Generate Actions');
    button.click();

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith(
        '/v1/generate_npc_actions',
        expect.objectContaining({
          description: '',
          challenge_rating: '0',
          monster_type: 'humanoid',
          size: 'medium',
        })
      );
    });
  });
});
