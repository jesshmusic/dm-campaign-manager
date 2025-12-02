import React from 'react';
import { SpellProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import InfoBlock from '../../components/InfoBlock/InfoBlock';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

import { SpellWrapper, SpellDescription } from './Spell.styles';

const Spell = (props: { spell: SpellProps; getSpell: (spellSlug: string) => void }) => {
  const { spell, getSpell } = props;
  const { spellSlug } = useParams<'spellSlug'>();

  React.useEffect(() => {
    getSpell(spellSlug!);
  }, [spellSlug]);

  const spellTitle = spell ? spell.name : 'Spell Loading...';

  const spellMats = spell && spell.material ? ` (${spell.material})` : '';

  return (
    <PageContainer
      pageTitle={spellTitle}
      description={`Spell: ${spellTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      {spell ? (
        <SpellWrapper>
          <PageTitle title={spellTitle} />
          <SpellDescription>
            {spell.spellLevel} {spell.school.toLowerCase()}
          </SpellDescription>
          <InfoBlock title="Casting Time" desc={spell.castingTime} />
          <InfoBlock title="Range" desc={spell.range} />
          <InfoBlock title="Components" desc={`${spell.components.join(', ')}${spellMats}`} />
          <InfoBlock title="Duration" desc={spell.duration} />
          <p>{spell.description}</p>
          <p>{spell.higherLevel}</p>
        </SpellWrapper>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    spell: state.spells.currentSpell,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSpell: (spellSlug: string) => {
      dispatch(rest.actions.getSpell({ id: spellSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spell);
