import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer';
import rest from '../../actions/api';
import PageTitle from '../../components/layout/PageTitle/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';
import { DndClass, ProfChoice, StartingEquipmentOption } from '../../utilities/types';
import { connect } from 'react-redux';
import Util from '../../utilities/utilities';

const styles = require('./dnd-class.module.scss');

type DndClassPageProps = {
  dndClass?: DndClass;
  dndClassSlug: string;
  getDndClass: (dndClassSlug: string) => void;
};

const InfoBlock = (props: { title: string, desc: string }) => (
  <div className={styles.infoBlock}>
    <span>{props.title}: </span>{props.desc}
  </div>
);

const DndClass = (props: DndClassPageProps) => {
  const { dndClass, dndClassSlug, getDndClass } = props;

  React.useEffect(() => {
    getDndClass(dndClassSlug);
  }, []);

  const dndClassTitle = dndClass ? dndClass.name : 'Class Loading...';

  const getProfs = (profs: { name: string, profType: string }[], profType: string): string => {
    const filteredProfs = profs.filter(prof => prof.profType === profType);
    if (filteredProfs.length === 0) {
      return 'None';
    }
    return filteredProfs.map(prof => prof.name).join(', ');
  };

  const getSkillChoices = (profChoices: ProfChoice[]): string => {
    let skillChoices = '';
    profChoices.forEach((profChoice) => {
      skillChoices += `Choose ${Util.numToWords[profChoice.numChoices]} from `;
      skillChoices += profChoice.proficiencies
        .map((prof) => prof.name.replace('Skill: ', '')).join(', ');
      skillChoices += '\n';
    });
    return skillChoices;
  };

  const getEquipmentOptions = (equipOption: StartingEquipmentOption): string => {
    return equipOption.options
      .map((option, index) => `(${Util.indexToLetter[index]}) ${option.name}`)
      .join(' or ');
  };

  return (
    <PageContainer
      pageTitle={dndClassTitle}
      description={`DndClass: ${dndClassTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      breadcrumbs={[
        { url: '/app/classes', isActive: false, title: 'Character Classes' },
        { isActive: true, title: dndClassTitle }
      ]}
    >
      <PageTitle title={dndClassTitle} />
      {dndClass ? (
        <div className={styles.page}>
          <div className={styles.infoSection}>
            <div className={styles.sectionGroup}>
              <h2 className={styles.sectionHeading}>Class Features</h2>
              <p>As a {dndClass.name.toLowerCase()}, you gain the following class features.</p>
            </div>
            <div className={styles.sectionGroup}>
              <h3 className={styles.subsectionHeading}>Hit Points</h3>
              <InfoBlock title='Hit Dice' desc={`1d${dndClass.hitDie} per ${dndClass.name.toLowerCase()} level`} />
              <InfoBlock title='Hit Points at 1st Level'
                         desc={`${dndClass.hitDie} + your Constitution modifier`} />
              <InfoBlock title='Hit Points at Higher Levels'
                         desc={`1d${dndClass.hitDie} (or ${(dndClass.hitDie / 2) + 1}) + your Constitution modifier per ${dndClass.name.toLowerCase()} level after 1st`} />
            </div>
            <div className={styles.sectionGroup}>
              <h3 className={styles.subsectionHeading}>Proficiencies</h3>
              <InfoBlock title='Armor'
                         desc={getProfs(dndClass.proficiencies, 'Armor')} />
              <InfoBlock title='Weapons'
                         desc={getProfs(dndClass.proficiencies, 'Weapons')} />
              <InfoBlock title='Tools'
                         desc={getProfs(dndClass.proficiencies, 'Other')} />
              <InfoBlock title='Saving Throws'
                         desc={dndClass.abilityScores.map(
                           (ability) => ability.fullName
                         ).join(', ')} />
              <InfoBlock title='Skills' desc={getSkillChoices(dndClass.proficiencyChoices)} />
            </div>
            <div className={styles.sectionGroup}>
              <h3 className={styles.subsectionHeading}>Equipment</h3>
              <p>You start with the following equipment, in addition to the equipment granted by your background:</p>
              <ul>
                {dndClass.startingEquipmentOptions.map((equipOption) => (
                  <li>{getEquipmentOptions(equipOption)}</li>
                ))}
                {dndClass.startingEquipment && dndClass.startingEquipment.length > 0 && (
                  <li>
                    {dndClass.startingEquipment.map((equip) => equip.name).join(', ')}
                  </li>
                )}
              </ul>
            </div>
          </div>
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    dndClass: state.dndClasses.currentDndClass
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDndClass: (dndClassSlug: string) => {
      dispatch(rest.actions.getDndClass({ slug: dndClassSlug }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClass);
