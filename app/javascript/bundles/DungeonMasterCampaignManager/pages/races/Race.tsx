import React from 'react';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { RaceProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useParams } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { parseEditionParams } from '../../utilities/editionUrls';

import { RacePageWrapper, Subheading, TraitName } from './Races.styles';

const Race = (props: { race?: RaceProps; getRace: (raceSlug: string) => void }) => {
  const { race, getRace } = props;
  const params = useParams<{ edition?: string; raceSlug?: string; param?: string }>();
  // Handle both /app/races/:edition/:slug and /app/races/:param routes
  const { slug: raceSlug } = parseEditionParams(params.edition, params.raceSlug || params.param);
  const { isEdition2014, isEdition2024 } = useEdition();

  // In 2024 edition, "Race" is called "Species"
  const typeLabel = isEdition2024 ? 'Species' : 'Race';

  React.useEffect(() => {
    if (raceSlug) {
      getRace(raceSlug);
    }
  }, [raceSlug]);

  const raceTitle = race ? race.name : `${typeLabel} Loading...`;

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
      description={`${typeLabel}: ${raceTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      pageTitle={raceTitle}
    >
      {race ? (
        <RacePageWrapper>
          <PageTitle title={raceTitle} isLegacy={isEdition2014} />
          <div>
            <div>
              <TraitName>Ability Score Increase. </TraitName>
              {abilityMods()}
            </div>
            <div>
              <TraitName>Speed. </TraitName> {race.speed} ft.
            </div>
            <div>
              <TraitName>Size. </TraitName>
              {race.sizeDescription}
            </div>
            <div>
              <TraitName>Age. </TraitName>
              {race.age}
            </div>
            <div>
              <TraitName>Languages. </TraitName> {race.languageDescription}
              <p>Starting languages: {race.languages.join(', ')}</p>
              {race.languageChoices.length > 0 ? (
                <p>Choose from: {race.languageChoices.join(', ')}</p>
              ) : null}
            </div>
            <div>
              <Subheading>Traits</Subheading>
              {race.traits &&
                race.traits.map((trait, index) => (
                  <div key={index}>
                    <TraitName>{trait.name} </TraitName>
                    {trait.desc.map((descPara, index) => (
                      <p key={index}>{descPara}</p>
                    ))}
                  </div>
                ))}
            </div>
          </div>
        </RacePageWrapper>
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
