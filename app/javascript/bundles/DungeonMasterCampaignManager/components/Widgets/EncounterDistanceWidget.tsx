import React, { useState } from 'react';
import styled from 'styled-components';
import Frame from '../Frame/Frame';
import { Label } from './Widgets.styles';
import Button from '../Button/Button';
import { Colors } from '../../utilities/enums';

type TerrainDistance = {
  terrain: string;
  diceFormula: string;
  diceCount: number;
  diceType: number;
  multiplier: number;
};

const terrainDistances: TerrainDistance[] = [
  { terrain: 'Arctic', diceFormula: '6d6 × 10', diceCount: 6, diceType: 6, multiplier: 10 },
  { terrain: 'Coastal', diceFormula: '2d10 × 10', diceCount: 2, diceType: 10, multiplier: 10 },
  { terrain: 'Desert', diceFormula: '6d6 × 10', diceCount: 6, diceType: 6, multiplier: 10 },
  { terrain: 'Forest', diceFormula: '2d8 × 10', diceCount: 2, diceType: 8, multiplier: 10 },
  { terrain: 'Grassland', diceFormula: '6d6 × 10', diceCount: 6, diceType: 6, multiplier: 10 },
  { terrain: 'Hill', diceFormula: '2d10 × 10', diceCount: 2, diceType: 10, multiplier: 10 },
  { terrain: 'Mountain', diceFormula: '4d10 × 10', diceCount: 4, diceType: 10, multiplier: 10 },
  { terrain: 'Swamp', diceFormula: '2d8 × 10', diceCount: 2, diceType: 8, multiplier: 10 },
  { terrain: 'Underdark', diceFormula: '2d6 × 10', diceCount: 2, diceType: 6, multiplier: 10 },
  { terrain: 'Urban', diceFormula: '2d6 × 10', diceCount: 2, diceType: 6, multiplier: 10 },
  { terrain: 'Waterborne', diceFormula: '6d6 × 10', diceCount: 6, diceType: 6, multiplier: 10 },
];

const TerrainSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const ResultBox = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  border: 2px solid ${({ theme }) => theme.colors.primary};
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  margin-bottom: 1rem;
`;

const DistanceResult = styled.div`
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 2.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const DiceFormula = styled.div`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 1rem;
  color: ${({ theme }) => theme.colors.gray600};
  margin-top: 0.5rem;
`;

const DiceBreakdown = styled.div`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray500};
  margin-top: 0.25rem;
`;

const ButtonWrapper = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 1rem;
`;

const EncounterDistanceWidget = (props: { hideFrame?: boolean }) => {
  const [selectedTerrain, setSelectedTerrain] = useState(terrainDistances[0]);
  const [result, setResult] = useState<number | null>(null);
  const [diceRolls, setDiceRolls] = useState<number[]>([]);

  const handleTerrainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const terrain = terrainDistances.find((t) => t.terrain === e.target.value);
    if (terrain) {
      setSelectedTerrain(terrain);
      setResult(null);
      setDiceRolls([]);
    }
  };

  const rollDice = () => {
    const rolls: number[] = [];
    for (let i = 0; i < selectedTerrain.diceCount; i++) {
      rolls.push(Math.floor(Math.random() * selectedTerrain.diceType) + 1);
    }
    setDiceRolls(rolls);
    const sum = rolls.reduce((acc, roll) => acc + roll, 0);
    setResult(sum * selectedTerrain.multiplier);
  };

  const renderContents = () => {
    return (
      <div>
        <Label htmlFor="terrain-distance-select">Select Terrain</Label>
        <TerrainSelect
          id="terrain-distance-select"
          value={selectedTerrain.terrain}
          onChange={handleTerrainChange}
        >
          {terrainDistances.map((t) => (
            <option key={t.terrain} value={t.terrain}>
              {t.terrain} ({t.diceFormula} ft)
            </option>
          ))}
        </TerrainSelect>

        <ResultBox>
          {result !== null ? (
            <>
              <DistanceResult data-testid="distance-result">{result} feet</DistanceResult>
              <DiceFormula>{selectedTerrain.diceFormula} feet</DiceFormula>
              <DiceBreakdown data-testid="dice-breakdown">
                Rolled: [{diceRolls.join(', ')}] = {diceRolls.reduce((a, b) => a + b, 0)} ×{' '}
                {selectedTerrain.multiplier}
              </DiceBreakdown>
            </>
          ) : (
            <>
              <DistanceResult>— feet</DistanceResult>
              <DiceFormula>{selectedTerrain.diceFormula} feet</DiceFormula>
              <DiceBreakdown>&nbsp;</DiceBreakdown>
            </>
          )}
        </ResultBox>

        <ButtonWrapper>
          <Button
            onClick={rollDice}
            color={Colors.primary}
            title="Roll Encounter Distance"
            data-testid="roll-button"
          />
        </ButtonWrapper>
      </div>
    );
  };

  return props.hideFrame ? (
    renderContents()
  ) : (
    <Frame title="Encounter Distance" subtitle="Roll starting distance for encounters">
      {renderContents()}
    </Frame>
  );
};

export default EncounterDistanceWidget;
