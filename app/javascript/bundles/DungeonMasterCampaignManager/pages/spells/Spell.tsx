import React from 'react';
import { SpellProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/layout/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import InfoBlock from '../../components/InfoBlock/InfoBlock';
import rest from '../../actions/api';
import { connect } from 'react-redux';

const Spell = (props: {
  spell: SpellProps;
  spellSlug: string;
  getSpell: (spellSlug: string) => void;
}) => {
  const { spell, getSpell, spellSlug } = props;

  React.useEffect(() => {
    getSpell(spellSlug);
  }, []);

  const spellTitle = spell ? spell.name : 'Spell Loading...';

  return (
    <PageContainer
      pageTitle={spellTitle}
      description={`Spell: ${spellTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      breadcrumbs={[
        { url: '/app/spells', isActive: false, title: 'Spells' },
        { isActive: true, title: spellTitle }
      ]}
    >
      {spell ? (
        <div className='container'>
          <PageTitle title={spellTitle} />
          <em>
            {spell.spellLevel} {spell.school.toLowerCase()}
          </em>
          <InfoBlock title='Casting Time' desc={spell.castingTime} />
          <InfoBlock title='Range' desc={spell.range} />
          <InfoBlock
            title='Components'
            desc={`${spell.components.join(', ')} (${spell.material})`}
          />
          <InfoBlock title='Duration' desc={spell.duration} />
          <div>{spell.description}</div>
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    spell: state.spells.currentSpell
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSpell: (spellSlug: string) => {
      dispatch(rest.actions.getSpell({ slug: spellSlug }));
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spell);
