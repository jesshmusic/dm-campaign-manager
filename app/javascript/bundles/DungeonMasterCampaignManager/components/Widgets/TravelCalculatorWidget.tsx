import React, { useState } from 'react';
import styled from 'styled-components';
import Frame from '../Frame/Frame';
import { TableFrame, Label } from './Widgets.styles';

const travelTerrain = [
  {
    terrain: 'Arctic',
    maximumPace: 'Fast',
    paceNote:
      'Appropriate equipment (such as skis) is necessary to keep up a Fast pace in Arctic terrain.',
    encounterDistance: '6d6 × 10 feet',
    foragingDC: 20,
    navigationDC: 10,
    searchDC: 10,
  },
  {
    terrain: 'Coastal',
    maximumPace: 'Normal',
    encounterDistance: '2d10 × 10 feet',
    foragingDC: 10,
    navigationDC: 5,
    searchDC: 15,
  },
  {
    terrain: 'Desert',
    maximumPace: 'Normal',
    encounterDistance: '6d6 × 10 feet',
    foragingDC: 20,
    navigationDC: 10,
    searchDC: 10,
  },
  {
    terrain: 'Forest',
    maximumPace: 'Normal',
    encounterDistance: '2d8 × 10 feet',
    foragingDC: 10,
    navigationDC: 15,
    searchDC: 15,
  },
  {
    terrain: 'Grassland',
    maximumPace: 'Fast',
    encounterDistance: '6d6 × 10 feet',
    foragingDC: 15,
    navigationDC: 5,
    searchDC: 15,
  },
  {
    terrain: 'Hill',
    maximumPace: 'Normal',
    encounterDistance: '2d10 × 10 feet',
    foragingDC: 15,
    navigationDC: 10,
    searchDC: 15,
  },
  {
    terrain: 'Mountain',
    maximumPace: 'Slow',
    encounterDistance: '4d10 × 10 feet',
    foragingDC: 20,
    navigationDC: 15,
    searchDC: 20,
  },
  {
    terrain: 'Swamp',
    maximumPace: 'Slow',
    encounterDistance: '2d8 × 10 feet',
    foragingDC: 10,
    navigationDC: 15,
    searchDC: 20,
  },
  {
    terrain: 'Underdark',
    maximumPace: 'Normal',
    encounterDistance: '2d6 × 10 feet',
    foragingDC: 20,
    navigationDC: 10,
    searchDC: 20,
  },
  {
    terrain: 'Urban',
    maximumPace: 'Normal',
    encounterDistance: '2d6 × 10 feet',
    foragingDC: 20,
    navigationDC: 15,
    searchDC: 15,
  },
  {
    terrain: 'Waterborne',
    maximumPace: 'Special',
    paceNote: "Characters' rate of travel while waterborne depends on the vehicle carrying them.",
    encounterDistance: '6d6 × 10 feet',
    foragingDC: 15,
    navigationDC: 10,
    searchDC: 15,
  },
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

const InfoBox = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  border-left: 4px solid ${({ theme }) => theme.colors.primary};
  padding: 1rem;
  margin-bottom: 1rem;
`;

const StatRow = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const StatBox = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  padding: 0.5rem;
  text-align: center;
`;

const StatLabel = styled.div`
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.gray600};
  text-transform: uppercase;
`;

const StatValue = styled.div`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 1.25rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.primary};
`;

const PaceNote = styled.p`
  font-style: italic;
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.gray600};
  margin-top: 0.5rem;
`;

const TravelCalculatorWidget = (props: { hideFrame?: boolean }) => {
  const [selectedTerrain, setSelectedTerrain] = useState(travelTerrain[0]);

  const handleTerrainChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const terrain = travelTerrain.find((t) => t.terrain === e.target.value);
    if (terrain) {
      setSelectedTerrain(terrain);
    }
  };

  const renderContents = () => {
    return (
      <div>
        <Label htmlFor="terrain-select">Select Terrain</Label>
        <TerrainSelect
          id="terrain-select"
          value={selectedTerrain.terrain}
          onChange={handleTerrainChange}
        >
          {travelTerrain.map((t) => (
            <option key={t.terrain} value={t.terrain}>
              {t.terrain}
            </option>
          ))}
        </TerrainSelect>

        <InfoBox>
          <StatRow>
            <StatBox>
              <StatLabel>Max Pace</StatLabel>
              <StatValue>{selectedTerrain.maximumPace}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Encounter Dist.</StatLabel>
              <StatValue style={{ fontSize: '1rem' }}>
                {selectedTerrain.encounterDistance}
              </StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Foraging DC</StatLabel>
              <StatValue>{selectedTerrain.foragingDC}</StatValue>
            </StatBox>
            <StatBox>
              <StatLabel>Navigation DC</StatLabel>
              <StatValue>{selectedTerrain.navigationDC}</StatValue>
            </StatBox>
          </StatRow>
          <StatRow>
            <StatBox>
              <StatLabel>Search DC</StatLabel>
              <StatValue>{selectedTerrain.searchDC}</StatValue>
            </StatBox>
          </StatRow>
          {selectedTerrain.paceNote && <PaceNote>{selectedTerrain.paceNote}</PaceNote>}
        </InfoBox>

        <TableFrame>
          <table>
            <thead>
              <tr>
                <th>Terrain</th>
                <th>Pace</th>
                <th>Forage</th>
                <th>Nav</th>
              </tr>
            </thead>
            <tbody>
              {travelTerrain.map((t) => (
                <tr
                  key={t.terrain}
                  style={{
                    fontWeight: t.terrain === selectedTerrain.terrain ? 'bold' : 'normal',
                  }}
                >
                  <td>{t.terrain}</td>
                  <td>{t.maximumPace}</td>
                  <td>DC {t.foragingDC}</td>
                  <td>DC {t.navigationDC}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableFrame>
      </div>
    );
  };

  return props.hideFrame ? (
    renderContents()
  ) : (
    <Frame title="Travel Calculator" subtitle="Quick reference for terrain travel">
      {renderContents()}
    </Frame>
  );
};

export default TravelCalculatorWidget;
