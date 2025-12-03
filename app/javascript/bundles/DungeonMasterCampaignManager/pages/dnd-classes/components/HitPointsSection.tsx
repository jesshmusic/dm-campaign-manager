import { DndClass } from '../../../utilities/types';
import React from 'react';
import InfoBlock from '../../../components/InfoBlock/InfoBlock';

import { SectionGroup, SubsectionHeading } from '../DndClass.styles';

const HitPointsSection = (props: { dndClass: DndClass }) => (
  <SectionGroup>
    <SubsectionHeading>Hit Points</SubsectionHeading>
    <InfoBlock
      title="Hit Dice"
      desc={`1d${props.dndClass.hitDie} per ${props.dndClass.name.toLowerCase()} level`}
    />
    <InfoBlock
      title="Hit Points at 1st Level"
      desc={`${props.dndClass.hitDie} + your Constitution modifier`}
    />
    <InfoBlock
      title="Hit Points at Higher Levels"
      desc={`1d${props.dndClass.hitDie} (or ${
        props.dndClass.hitDie / 2 + 1
      }) + your Constitution modifier per ${props.dndClass.name.toLowerCase()} level after 1st`}
    />
  </SectionGroup>
);

export default HitPointsSection;
