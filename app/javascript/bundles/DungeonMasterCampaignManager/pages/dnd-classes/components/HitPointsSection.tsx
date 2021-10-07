import { DndClass } from '../../../utilities/types';
import React from 'react';
import InfoBlock from './InfoBlock';

const styles = require('../dnd-class.module.scss');

const HitPointsSection = (props: { dndClass: DndClass }) => (
  <div className={styles.sectionGroup}>
    <h3 className={styles.subsectionHeading}>Hit Points</h3>
    <InfoBlock
      title="Hit Dice"
      desc={`1d${
        props.dndClass.hitDie
      } per ${props.dndClass.name.toLowerCase()} level`}
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
  </div>
);

export default HitPointsSection;
