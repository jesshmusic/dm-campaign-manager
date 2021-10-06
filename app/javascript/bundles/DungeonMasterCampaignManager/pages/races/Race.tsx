import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import { RaceProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';

const styles = require('./races.module.scss');

const Race = (props: {
  race?: RaceProps;
  raceSlug: string;
  getRace: (raceSlug: string) => void;
}) => {
  const { race, raceSlug, getRace } = props;

  React.useEffect(() => {
    getRace(raceSlug);
  }, []);

  const raceTitle = race ? race.name : 'Race Loading...';

  const abilityMods = () => {
    if (race) {
      if (race.name === 'Human') {
        return 'Your ability scores each increase by 1.';
      }
      const mods: string[] = [];
      if (race.strengthModifier !== 0) {
        mods.push(`your strength increases by ${race.strengthModifier}`);
      }
      if (race.dexterityModifier !== 0) {
        mods.push(`your dexterity increases by ${race.dexterityModifier}`);
      }
      if (race.constitutionModifier !== 0) {
        mods.push(
          `your constitution increases by ${race.constitutionModifier}`
        );
      }
      if (race.intelligenceModifier !== 0) {
        mods.push(
          `your intelligence increases by ${race.intelligenceModifier}`
        );
      }
      if (race.wisdomModifier !== 0) {
        mods.push(`your wisdom increases by ${race.wisdomModifier}`);
      }
      if (race.charismaModifier !== 0) {
        mods.push(`your charisma increases by ${race.charismaModifier}`);
      }
      const result = mods.join(', and ') + '.';
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
    return '';
  };

  return (
    <PageContainer
      breadcrumbs={[
        { url: '/app/races', isActive: false, title: 'Races' },
        { isActive: true, title: raceTitle },
      ]}
      description={`Monster: ${raceTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      pageTitle={raceTitle}
    >
      {race ? (
        <div className="container">
          <PageTitle title={raceTitle} />
          <div>
            <div>
              <span className={styles.traitName}>Ability Score Increase. </span>
              {abilityMods()}
            </div>
            <div>
              <span className={styles.traitName}>Speed. </span> {race.speed} ft.
            </div>
            <div>
              <span className={styles.traitName}>Size. </span>
              {race.sizeDescription}
            </div>
            <div>
              <span className={styles.traitName}>Age. </span>
              {race.age}
            </div>
            <div>
              <span className={styles.traitName}>Languages. </span>{' '}
              {race.languageDescription}
              <p>Starting languages: {race.languages.join(', ')}</p>
              {race.languageChoices.length > 0 ? (
                <p>Choose from: {race.languageChoices.join(', ')}</p>
              ) : null}
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
    race: state.races.currentRace,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRace: (raceSlug: string) => {
      dispatch(rest.actions.getRace({ slug: raceSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Race);
