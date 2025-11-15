import { DndClass, ProfChoice } from '../../../utilities/types';
import Util from '../../../utilities/utilities';
import React from 'react';
import InfoBlock from '../../../components/InfoBlock/InfoBlock';

const styles = require('../dnd-class.module.scss');

const ProficienciesSection = (props: { dndClass: DndClass }) => {
  const { dndClass } = props;

  const getProfs = (profs: { name: string; profType: string }[], profType: string): string => {
    const filteredProfs = profs.filter((prof) => prof.profType === profType);
    if (filteredProfs.length === 0) {
      return 'None';
    }
    return filteredProfs.map((prof) => prof.name).join(', ');
  };

  const getSkillChoices = (profChoices: ProfChoice[]): string => {
    let skillChoices = '';
    profChoices.forEach((profChoice) => {
      skillChoices += `Choose ${Util.numToWords[profChoice.numChoices]} from `;
      skillChoices += profChoice.proficiencies
        .map((prof) => prof.name.replace('Skill: ', ''))
        .join(', ');
      skillChoices += '\n';
    });
    return skillChoices;
  };

  return (
    <div className={styles.sectionGroup}>
      <h3 className={styles.subsectionHeading}>Proficiencies</h3>
      <InfoBlock title="Armor" desc={getProfs(dndClass.proficiencies, 'Armor')} />
      <InfoBlock title="Weapons" desc={getProfs(dndClass.proficiencies, 'Weapons')} />
      <InfoBlock title="Tools" desc={getProfs(dndClass.proficiencies, 'Other')} />
      <InfoBlock
        title="Saving Throws"
        desc={dndClass.abilityScores.map((ability) => ability.fullName).join(', ')}
      />
      <InfoBlock title="Skills" desc={getSkillChoices(dndClass.proficiencyChoices)} />
    </div>
  );
};

export default ProficienciesSection;
