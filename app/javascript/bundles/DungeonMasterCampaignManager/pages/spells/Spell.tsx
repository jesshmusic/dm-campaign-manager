import React from 'react';
import { SpellProps, UserProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import InfoBlock from '../../components/InfoBlock/InfoBlock';
import rest from '../../api/api';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store/store';
import { useParams, useNavigate } from 'react-router-dom';
import { useEdition } from '../../contexts/EditionContext';
import { parseEditionParams, getContentUrl } from '../../utilities/editionUrls';
import { AdminActions } from '../../components/shared';
import SpellFormModal from './SpellFormModal';

import { SpellWrapper, SpellDescription } from './Spell.styles';

type SpellPageProps = {
  spell: SpellProps;
  getSpell: (spellSlug: string) => void;
  deleteSpell: (spellId: number) => Promise<void>;
  currentUser?: UserProps;
};

const Spell = (props: SpellPageProps) => {
  const { spell, getSpell, deleteSpell, currentUser } = props;
  const params = useParams<{ edition?: string; spellSlug?: string; param?: string }>();
  const navigate = useNavigate();
  // Handle both /app/spells/:edition/:slug and /app/spells/:param routes
  const { slug: spellSlug } = parseEditionParams(params.edition, params.spellSlug || params.param);
  const { edition, isEdition2014 } = useEdition();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (spellSlug) {
      getSpell(spellSlug);
    }
  }, [spellSlug]);

  const handleEditSuccess = () => {
    if (spellSlug) {
      getSpell(spellSlug);
    }
  };

  const handleDeleteSuccess = () => {
    navigate(getContentUrl('spells', '', edition));
  };

  const handleDelete = async () => {
    if (spell && window.confirm(`Are you sure you want to delete ${spell.name}?`)) {
      await deleteSpell(spell.id);
      handleDeleteSuccess();
    }
  };

  const spellTitle = spell ? spell.name : 'Spell Loading...';

  const spellMats = spell && spell.material ? ` (${spell.material})` : '';

  return (
    <PageContainer
      description={`Spell: ${spellTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      maxWidth
      pageTitle={spellTitle}
    >
      {spell ? (
        <SpellWrapper>
          <PageTitle title={spellTitle} isLegacy={isEdition2014} />
          <AdminActions
            currentUser={currentUser}
            onEdit={() => setIsEditModalOpen(true)}
            onDelete={handleDelete}
          />
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
          <SpellFormModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            mode="edit"
            initialData={spell}
            onSuccess={handleEditSuccess}
            onDeleteSuccess={handleDeleteSuccess}
          />
        </SpellWrapper>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state: RootState) {
  return {
    spell: state.spells.currentSpell,
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch: AppDispatch) {
  return {
    getSpell: (spellSlug: string) => {
      dispatch(rest.actions.getSpell({ id: spellSlug }));
    },
    deleteSpell: (spellId: number) => {
      return dispatch(rest.actions.deleteSpell({ id: spellId }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Spell);
