import React from 'react';
import { SpellProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import InfoBlock from '../../components/InfoBlock/InfoBlock';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { parseEditionParams } from '../../utilities/editionUrls';

import { SpellWrapper, SpellDescription } from './Spell.styles';

const Spell = (props: { spell: SpellProps; getSpell: (spellSlug: string) => void }) => {
  const { spell, getSpell } = props;
  const params = useParams<{ edition?: string; spellSlug?: string; param?: string }>();
  // Handle both /app/spells/:edition/:slug and /app/spells/:param routes
  const { slug: spellSlug } = parseEditionParams(params.edition, params.spellSlug || params.param);
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    if (spellSlug) {
      getSpell(spellSlug);
    }
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
          <PageTitle title={spellTitle} isLegacy={isEdition2014} />
          <SpellDescription>
            {spell.spellLevel} {spell.school.toLowerCase()}
          </SpellDescription>
          <InfoBlock title="Casting Time" desc={spell.castingTime} />
          <InfoBlock title="Range" desc={spell.range} />
          <InfoBlock title="Components" desc={`${spell.components.join(', ')}${spellMats}`} />
          <InfoBlock title="Duration" desc={spell.duration} />
          <p>{spell.description}</p>
          {spell.higherLevel && (
            <p>
              {spell.higherLevel.startsWith('**Using a Higher-Level Spell Slot.**') ? (
                <>
                  <strong>Using a Higher-Level Spell Slot.</strong>
                  {spell.higherLevel.replace('**Using a Higher-Level Spell Slot.** ', ' ')}
                </>
              ) : (
                spell.higherLevel
              )}
            </p>
          )}
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
