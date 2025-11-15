import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { RaceProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useParams } from 'react-router-dom';

const styles = require('./races.module.scss');

const Race = (props: { race?: RaceProps; getRace: (raceSlug: string) => void }) => {
  const { race, getRace } = props;
  const { raceSlug } = useParams<'raceSlug'>();

  React.useEffect(() => {
    getRace(raceSlug!);
  }, [raceSlug]);

  const raceTitle = race ? race.name : 'Race Loading...';

  const abilityMods = () => {
    if (race) {
      if (race.name === 'Human') {
        return 'Your ability scores each increase by 1.';
      }
      const result =
        race.abilityBonusOptions
          .map((ability) => {
            return `your ${ability.ability.toLowerCase()} increases by ${ability.bonus}`;
          })
          .join(', and ') + '.';
      return result.charAt(0).toUpperCase() + result.slice(1);
    }
    return '';
  };

  return (
    <PageContainer
      description={`Monster: ${raceTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      pageTitle={raceTitle}
    >
      {race ? (
        <div className={styles.racePage}>
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
              <span className={styles.traitName}>Languages. </span> {race.languageDescription}
              <p>Starting languages: {race.languages.join(', ')}</p>
              {race.languageChoices.length > 0 ? (
                <p>Choose from: {race.languageChoices.join(', ')}</p>
              ) : null}
            </div>
            <div>
              <h3 className={styles.subheading}>Traits</h3>
              {race.traits &&
                race.traits.map((trait, index) => (
                  <div key={index}>
                    <span className={styles.traitName}>{trait.name} </span>
                    {trait.desc.map((descPara, index) => (
                      <p key={index}>{descPara}</p>
                    ))}
                  </div>
                ))}
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
      dispatch(rest.actions.getRace({ id: raceSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Race);
