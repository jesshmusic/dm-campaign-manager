import React from 'react';
import rest from '../../actions/api';
import { connect } from 'react-redux';
import { RaceProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle';
import DndSpinner from '../../components/layout/DndSpinner';

const Race = (props: {
  race?: RaceProps,
  raceSlug: string,
  getRace: (raceSlug: string) => void
}) => {
  const { race, raceSlug, getRace } = props;

  React.useEffect(() => {
    getRace(raceSlug);
  }, []);

  const raceTitle = race ? race.name : 'Race Loading...';

  const abilityMods = () => {
    if (race) {
      const mods: string[] = [];
      if (race.strengthModifier !== 0) {
        mods.push(`Strength: ${race.strengthModifier}`);
      }
      if (race.dexterityModifier !== 0) {
        mods.push(`Dexterity: ${race.dexterityModifier}`);
      }
      if (race.constitutionModifier !== 0) {
        mods.push(`Constitution: ${race.constitutionModifier}`);
      }
      if (race.intelligenceModifier !== 0) {
        mods.push(`Intelligence: ${race.intelligenceModifier}`);
      }
      if (race.wisdomModifier !== 0) {
        mods.push(`Wisdom: ${race.wisdomModifier}`);
      }
      if (race.charismaModifier !== 0) {
        mods.push(`Charisma: ${race.charismaModifier}`);
      }
      return mods.join(', ');
    }
    return '';
  };

  return (
    <PageContainer
      breadcrumbs={[
        { url: '/app/races', isActive: false, title: 'Races' },
        { isActive: true, title: raceTitle }
      ]}
      description={`Monster: ${raceTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      pageTitle={raceTitle}>
      <PageTitle title={raceTitle} />
      {race ? (
        <div className='container'>
          <div>
            <div>
              <strong>Ability Bonuses:</strong> {abilityMods()}
            </div>
            <div>
              <strong>Speed:</strong> {race.speed} ft.
            </div>
            <div>
              <strong>{race.size}.</strong> {race.sizeDescription}
            </div>
            <div>
              <strong>Age.</strong> {race.age}
            </div>
            <div>
              <strong>Languages.</strong> {race.languageDescription}
              <p>Starting languages: {race.languages.join(', ')}</p>
              {race.languageChoices.length > 0 ? (
                <p>Choose from: {race.languageChoices.join(', ')}</p>
              ) : null}
            </div>
          </div>
        </div>
      ) : <DndSpinner />}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    race: state.races.currentRace
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getRace: (raceSlug: string) => {
      dispatch(rest.actions.getRace({ slug: raceSlug }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Race);