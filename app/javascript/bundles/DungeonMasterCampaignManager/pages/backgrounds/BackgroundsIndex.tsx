import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { GiPerson } from 'react-icons/gi';
import { Background } from '../../reducers/backgrounds';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';
import { UserProps } from '../../utilities/types';
import { AdminNewButton } from '../../components/shared';
import BackgroundFormModal from './BackgroundFormModal';

import {
  BackgroundsGrid,
  BackgroundCard,
  BackgroundCardHeader,
  BackgroundCardIcon,
  BackgroundCardTitle,
  BackgroundDetail,
} from './Backgrounds.styles';

type BackgroundsIndexProps = {
  backgrounds: Background[];
  loading: boolean;
  currentUser?: UserProps;
  getBackgrounds: () => void;
};

const BackgroundsIndex = ({
  backgrounds,
  loading,
  currentUser,
  getBackgrounds,
}: BackgroundsIndexProps) => {
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false);

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam || param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  React.useEffect(() => {
    getBackgrounds();
  }, []);

  const handleCreateSuccess = () => {
    getBackgrounds();
  };

  // Backgrounds are only available in 2024 edition
  if (isEdition2014) {
    return (
      <PageContainer
        description="D&D 5th Edition Character Backgrounds. Dungeon Master's Toolbox is a free resource for DMs."
        maxWidth
        pageTitle="Backgrounds"
      >
        <PageTitle title="Backgrounds" isLegacy />
        <p>
          Backgrounds with structured ability scores and feats are a 2024 edition feature. Switch to
          the 2024 edition to view backgrounds.
        </p>
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description="D&D 5th Edition Character Backgrounds. Dungeon Master's Toolbox is a free resource for DMs."
      maxWidth
      pageTitle="Backgrounds"
    >
      <PageTitle title="Backgrounds" />
      <AdminNewButton
        currentUser={currentUser}
        onClick={() => setIsCreateModalOpen(true)}
        label="New Background"
      />
      {loading ? (
        <DndSpinner />
      ) : (
        <BackgroundsGrid>
          {backgrounds.map((background) => (
            <Link key={background.slug} to={getContentUrl('backgrounds', background.slug, edition)}>
              <BackgroundCard>
                <BackgroundCardHeader>
                  <BackgroundCardIcon>
                    <GiPerson />
                  </BackgroundCardIcon>
                  <BackgroundCardTitle>{background.name}</BackgroundCardTitle>
                </BackgroundCardHeader>
                <BackgroundDetail>
                  <strong>Feat:</strong> {background.feat_name}
                </BackgroundDetail>
                <BackgroundDetail>
                  <strong>Skills:</strong> {background.skillProficiencies?.join(', ')}
                </BackgroundDetail>
              </BackgroundCard>
            </Link>
          ))}
        </BackgroundsGrid>
      )}
      <BackgroundFormModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        mode="create"
        onSuccess={handleCreateSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state: any) {
  return {
    backgrounds: state.backgrounds.backgrounds,
    loading: state.backgrounds.loading,
    currentUser: state.users.currentUser,
  };
}

function mapDispatchToProps(dispatch: any) {
  return {
    getBackgrounds: () => {
      dispatch(rest.actions.getBackgrounds());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundsIndex);
