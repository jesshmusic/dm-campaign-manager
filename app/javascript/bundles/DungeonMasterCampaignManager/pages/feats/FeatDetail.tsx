import React from 'react';
import { connect } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import ReactMarkdown from 'react-markdown';
import { Feat } from '../../reducers/feats';
import { parseEditionParams } from '../../utilities/editionUrls';
import { UserProps } from '../../utilities/types';
import { AdminActions } from '../../components/shared';
import FeatFormModal from './FeatFormModal';

import {
  FeatDetailPage,
  FeatHeader,
  FeatCategory,
  FeatPrerequisite,
  FeatDescription,
  RepeatableBadge,
} from './Feats.styles';

type FeatDetailProps = {
  currentFeat: Feat | null;
  loading: boolean;
  currentUser?: UserProps;
  token?: string;
  getFeat: (slug: string) => void;
  deleteFeat: (id: number, token?: string) => void;
};

const FeatDetail = ({
  currentFeat,
  loading,
  currentUser,
  token,
  getFeat,
  deleteFeat,
}: FeatDetailProps) => {
  const params = useParams<{ edition?: string; featSlug?: string; param?: string }>();
  const navigate = useNavigate();
  // Handle both /app/feats/:edition/:slug and /app/feats/:param routes
  const { slug: featSlug } = parseEditionParams(params.edition, params.featSlug || params.param);
  const { isEdition2014 } = useEdition();
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  React.useEffect(() => {
    if (featSlug) {
      getFeat(featSlug);
    }
  }, [featSlug]);

  const handleEditSuccess = () => {
    if (featSlug) {
      getFeat(featSlug);
    }
  };

  const handleDelete = () => {
    if (currentFeat?.id) {
      deleteFeat(currentFeat.id, token);
      // Navigate back to feats list after delete
      setTimeout(() => {
        navigate('/app/feats');
      }, 500);
    }
  };

  if (isEdition2014) {
    return (
      <PageContainer description="D&D 5th Edition Feat." maxWidth pageTitle="Feat">
        <PageTitle title="Feat" isLegacy />
        <p>Feats are a 2024 edition feature. Switch to the 2024 edition to view this feat.</p>
      </PageContainer>
    );
  }

  if (loading || !currentFeat) {
    return (
      <PageContainer description="D&D 5th Edition Feat." maxWidth pageTitle="Feat">
        <DndSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      description={`${currentFeat.name} - D&D 5th Edition ${currentFeat.category} Feat`}
      maxWidth
      pageTitle={currentFeat.name}
    >
      <PageTitle title={currentFeat.name} />
      <AdminActions
        currentUser={currentUser}
        onEdit={() => setIsEditModalOpen(true)}
        onDelete={handleDelete}
      />

      <FeatDetailPage>
        <FeatHeader>
          <FeatCategory>
            {currentFeat.category} Feat
            {currentFeat.repeatable && (
              <>
                {' '}
                <RepeatableBadge>Repeatable</RepeatableBadge>
              </>
            )}
          </FeatCategory>

          {currentFeat.prerequisite && (
            <FeatPrerequisite>
              <strong>Prerequisite:</strong> {currentFeat.prerequisite}
            </FeatPrerequisite>
          )}
        </FeatHeader>

        <FeatDescription>
          <ReactMarkdown>{currentFeat.description}</ReactMarkdown>
        </FeatDescription>
      </FeatDetailPage>
      <FeatFormModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        mode="edit"
        initialData={currentFeat}
        onSuccess={handleEditSuccess}
      />
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentFeat: state.feats.currentFeat,
    loading: state.feats.currentFeatLoading,
    currentUser: state.users.currentUser,
    token: state.users.token,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFeat: (slug: string) => {
      dispatch(rest.actions.getFeat({ id: slug }));
    },
    deleteFeat: (id: number, token?: string) => {
      dispatch(
        rest.actions.deleteFeat(
          { id },
          {
            body: JSON.stringify({ token }),
          },
        ),
      );
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatDetail);
