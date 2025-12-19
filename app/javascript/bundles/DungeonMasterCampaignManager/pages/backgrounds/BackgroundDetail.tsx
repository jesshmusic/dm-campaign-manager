import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { Background } from '../../reducers/backgrounds';
import { parseEditionParams } from '../../utilities/editionUrls';
import { UserProps } from '../../utilities/types';
import { AdminActions } from '../../components/shared';
import BackgroundFormModal from './BackgroundFormModal';

import {
  BackgroundDetailPage,
  BackgroundSection,
  TagList,
  Tag,
  EquipmentOptions,
  EquipmentOption,
} from './Backgrounds.styles';

type BackgroundDetailProps = {
  currentBackground: Background | null;
  loading: boolean;
  currentUser?: UserProps;
  token?: string;
  getBackground: (slug: string) => void;
  deleteBackground: (id: number, token?: string) => void;
};

const BackgroundDetail = ({
  currentBackground,
  loading,
  currentUser,
  token,
  getBackground,
  deleteBackground,
}: BackgroundDetailProps) => {
  const params = useParams<{ edition?: string; backgroundSlug?: string; param?: string }>();
  const navigate = useNavigate();
  // Handle both /app/backgrounds/:edition/:slug and /app/backgrounds/:param routes
  const { slug: backgroundSlug } = parseEditionParams(
    params.edition,
    params.backgroundSlug || params.param,
  );
  const { isEdition2014 } = useEdition();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (backgroundSlug) {
      getBackground(backgroundSlug);
    }
  }, [backgroundSlug]);

  const handleEditSuccess = () => {
    if (backgroundSlug) {
      getBackground(backgroundSlug);
    }
  };

  const handleDelete = () => {
    if (currentBackground?.id) {
      deleteBackground(currentBackground.id, token);
      // Navigate back to backgrounds list after delete
      setTimeout(() => {
        navigate('/app/backgrounds');
      }, 500);
    }
  };

  if (isEdition2014) {
    return (
      <PageContainer
        description="D&D 5th Edition Character Background."
        maxWidth
        pageTitle="Background"
      >
        <PageTitle title="Background" isLegacy />
        <p>
          Backgrounds are a 2024 edition feature. Switch to the 2024 edition to view this
          background.
        </p>
      </PageContainer>
    );
  }

  if (loading || !currentBackground) {
    return (
      <PageContainer
        description="D&D 5th Edition Character Background."
        maxWidth
        pageTitle="Background"
      >
        <DndSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description={`${currentBackground.name} - D&D 5th Edition Character Background`}
      maxWidth
      pageTitle={currentBackground.name}
    >
      <PageTitle title={currentBackground.name} />
      <AdminActions
        currentUser={currentUser}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDelete}
      />

      <BackgroundDetailPage>
        {currentBackground.description && (
          <BackgroundSection>
            <p>{currentBackground.description}</p>
          </BackgroundSection>
        )}

        <BackgroundSection>
          <h3>Ability Scores</h3>
          <TagList>
            {currentBackground.abilityScores?.map((ability) => (
              <Tag key={ability}>{ability}</Tag>
            ))}
          </TagList>
        </BackgroundSection>

        <BackgroundSection>
          <h3>Feat</h3>
          <p>{currentBackground.feat_name}</p>
        </BackgroundSection>

        <BackgroundSection>
          <h3>Skill Proficiencies</h3>
          <TagList>
            {currentBackground.skillProficiencies?.map((skill) => (
              <Tag key={skill}>{skill}</Tag>
            ))}
          </TagList>
        </BackgroundSection>

        <BackgroundSection>
          <h3>Tool Proficiency</h3>
          <p>{currentBackground.tool_proficiency}</p>
        </BackgroundSection>

        <BackgroundSection>
          <h3>Equipment</h3>
          <EquipmentOptions>
            <EquipmentOption>
              <strong>Option A</strong>
              {currentBackground.equipment_option_a}
            </EquipmentOption>
            <EquipmentOption>
              <strong>Option B</strong>
              {currentBackground.equipment_option_b}
            </EquipmentOption>
          </EquipmentOptions>
        </BackgroundSection>
      </BackgroundDetailPage>
      <BackgroundFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={currentBackground}
        onSuccess={handleEditSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentBackground: state.backgrounds.currentBackground,
    loading: state.backgrounds.currentBackgroundLoading,
    currentUser: state.users.currentUser,
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getBackground: (slug: string) => {
      dispatch(rest.actions.getBackground({ id: slug }));
    },
    deleteBackground: (id: number, token?: string) => {
      dispatch(
        rest.actions.deleteBackground(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundDetail);
