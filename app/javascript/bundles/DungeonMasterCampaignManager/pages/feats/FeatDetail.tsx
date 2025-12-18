import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import ReactMarkdown from 'react-markdown';
import { Feat } from '../../reducers/feats';
import { parseEditionParams } from '../../utilities/editionUrls';

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
  getFeat: (slug: string) => void;
};

const FeatDetail = ({ currentFeat, loading, getFeat }: FeatDetailProps) => {
  const params = useParams<{ edition?: string; featSlug?: string; param?: string }>();
  // Handle both /app/feats/:edition/:slug and /app/feats/:param routes
  const { slug: featSlug } = parseEditionParams(params.edition, params.featSlug || params.param);
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    if (featSlug) {
      getFeat(featSlug);
    }
  }, [featSlug]);

  if (isEdition2014) {
    return (
      <PageContainer pageTitle="Feat" description="D&D 5th Edition Feat.">
        <PageTitle title="Feat" isLegacy />
        <p>Feats are a 2024 edition feature. Switch to the 2024 edition to view this feat.</p>
      </PageContainer>
    );
  }

  if (loading || !currentFeat) {
    return (
      <PageContainer pageTitle="Feat" description="D&D 5th Edition Feat.">
        <DndSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle={currentFeat.name}
      description={`${currentFeat.name} - D&D 5th Edition ${currentFeat.category} Feat`}
    >
      <PageTitle title={currentFeat.name} />

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
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentFeat: state.feats.currentFeat,
    loading: state.feats.currentFeatLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFeat: (slug: string) => {
      dispatch(rest.actions.getFeat({ id: slug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatDetail);
