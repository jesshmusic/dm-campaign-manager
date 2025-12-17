import React, { useState } from 'react';
import styled from 'styled-components';
import Frame from '../Frame/Frame';
import { Label } from './Widgets.styles';

type EnvironmentalEffect = {
  name: string;
  description: string;
};

const environmentalEffects: EnvironmentalEffect[] = [
  {
    name: 'Deep Water',
    description:
      "Swimming through deep water (more than 100 feet deep) presents additional challenges because of the water's pressure and cold temperature. After each hour of swimming in deep water, a creature that lacks a Swim Speed must succeed on a DC 10 Constitution saving throw or gain 1 Exhaustion level.",
  },
  {
    name: 'Extreme Cold',
    description:
      'When the temperature is 0 degrees Fahrenheit or lower, a creature exposed to the extreme cold must succeed on a DC 10 Constitution saving throw at the end of each hour or gain 1 Exhaustion level. Creatures that have Resistance or Immunity to Cold damage automatically succeed on the save.',
  },
  {
    name: 'Extreme Heat',
    description:
      'When the temperature is 100 degrees Fahrenheit or higher, a creature exposed to the extreme heat and without access to drinkable water must succeed on a Constitution saving throw at the end of each hour or gain 1 Exhaustion level. The DC is 5 for the first hour and increases by 1 for each additional hour. Creatures wearing Medium or Heavy armor have Disadvantage on the save. Creatures that have Resistance or Immunity to Fire damage automatically succeed on the save.',
  },
  {
    name: 'Frigid Water',
    description:
      'A creature can be immersed in frigid water for a number of minutes equal to its Constitution score before suffering any ill effects. Each additional minute spent in frigid water requires the creature to succeed on a DC 10 Constitution saving throw or gain 1 Exhaustion level. Creatures with Resistance or Immunity to Cold damage automatically succeed on the save, as do creatures that are naturally adapted to living in ice-cold water.',
  },
  {
    name: 'Heavy Precipitation',
    description:
      'Everything within an area of heavy rain or heavy snowfall is Lightly Obscured, and creatures in the area have Disadvantage on all Wisdom (Perception) checks. Heavy rain also extinguishes open flames.',
  },
  {
    name: 'High Altitude',
    description:
      "Traveling at altitudes of 10,000 feet or higher above sea level is taxing for most creatures because of the reduced amount of oxygen in the air. Each hour such a creature spends traveling at high altitude counts as 2 hours for the purpose of determining how long that creature can travel. Creatures can become acclimated to a high altitude by spending 30 days or more at this elevation. Creatures can't become acclimated to elevations above 20,000 feet unless they are native to such environments.",
  },
  {
    name: 'Slippery Ice',
    description:
      'Slippery ice is Difficult Terrain. A creature that moves onto slippery ice for the first time on a turn or starts its turn there must succeed on a DC 10 Dexterity saving throw or have the Prone condition.',
  },
  {
    name: 'Strong Wind',
    description:
      'Strong wind imposes Disadvantage on ranged attack rolls with weapons. It also extinguishes open flames and disperses fog. A flying creature in a strong wind must land at the end of its turn or fall. A strong wind in a desert can create a sandstorm that imposes Disadvantage on Wisdom (Perception) checks.',
  },
  {
    name: 'Thin Ice',
    description:
      'Thin ice has a weight tolerance of 3d10 × 10 pounds per 10-foot-square area. Whenever the total weight on an area of thin ice exceeds its tolerance, the ice in that area breaks. All creatures on broken ice fall through. Below the ice is frigid water.',
  },
];

const EffectSelect = styled.select`
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  background-color: ${({ theme }) => theme.colors.white};
`;

const EffectCard = styled.div`
  background-color: ${({ theme }) => theme.colors.gray100};
  border-left: 4px solid ${({ theme }) => theme.colors.danger};
  border-radius: 0 4px 4px 0;
  padding: 1rem;
  margin-bottom: 1rem;
`;

const EffectName = styled.h4`
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 1.25rem;
  color: ${({ theme }) => theme.colors.danger};
  margin: 0 0 0.5rem 0;
`;

const EffectDescription = styled.p`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.875rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.gray800};
  margin: 0;
`;

const QuickRefList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.25rem;

  @media (min-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
`;

const QuickRefItem = styled.li<{ $isSelected: boolean }>`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.75rem;
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.danger : theme.colors.gray200};
  color: ${({ theme, $isSelected }) => ($isSelected ? theme.colors.white : theme.colors.gray700)};
  border-radius: 4px;
  cursor: pointer;
  text-align: center;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme, $isSelected }) =>
      $isSelected ? theme.colors.danger : theme.colors.gray300};
  }
`;

const EnvironmentalEffectsWidget = (props: { hideFrame?: boolean }) => {
  const [selectedEffect, setSelectedEffect] = useState(environmentalEffects[0]);

  const handleEffectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const effect = environmentalEffects.find((ef) => ef.name === e.target.value);
    if (effect) {
      setSelectedEffect(effect);
    }
  };

  const handleQuickSelect = (effectName: string) => {
    const effect = environmentalEffects.find((ef) => ef.name === effectName);
    if (effect) {
      setSelectedEffect(effect);
    }
  };

  const renderContents = () => {
    return (
      <div>
        <Label htmlFor="effect-select">Select Effect</Label>
        <EffectSelect
          id="effect-select"
          value={selectedEffect.name}
          onChange={handleEffectChange}
          data-testid="effect-select"
        >
          {environmentalEffects.map((ef) => (
            <option key={ef.name} value={ef.name}>
              {ef.name}
            </option>
          ))}
        </EffectSelect>

        <EffectCard data-testid="effect-card">
          <EffectName>{selectedEffect.name}</EffectName>
          <EffectDescription>{selectedEffect.description}</EffectDescription>
        </EffectCard>

        <Label>Quick Reference</Label>
        <QuickRefList>
          {environmentalEffects.map((ef) => (
            <QuickRefItem
              key={ef.name}
              $isSelected={ef.name === selectedEffect.name}
              onClick={() => handleQuickSelect(ef.name)}
              data-testid={`quick-ref-${ef.name.toLowerCase().replace(/\s+/g, '-')}`}
            >
              {ef.name}
            </QuickRefItem>
          ))}
        </QuickRefList>
      </div>
    );
  };

  return props.hideFrame ? (
    renderContents()
  ) : (
    <Frame title="Environmental Effects" subtitle="Hazards and conditions reference">
      {renderContents()}
    </Frame>
  );
};

export default EnvironmentalEffectsWidget;
