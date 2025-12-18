import React from 'react';
import { connect } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { GiUpgrade, GiSwordsPower, GiBowArrow, GiSparkSpirit } from 'react-icons/gi';
import { Feat } from '../../reducers/feats';
import { getContentUrl, isValidEdition } from '../../utilities/editionUrls';

import {
  FeatsContainer,
  CategorySection,
  CategoryTitle,
  FeatsGrid,
  FeatCard,
  FeatCardHeader,
  FeatCardIcon,
  FeatCardTitle,
  FeatCardMeta,
  FeatCardPrerequisite,
  RepeatableBadge,
} from './Feats.styles';

type FeatsIndexProps = {
  feats: Feat[];
  loading: boolean;
  getFeats: () => void;
};

const categoryIcons: Record<string, React.ReactNode> = {
  Origin: <GiSparkSpirit />,
  General: <GiUpgrade />,
  'Fighting Style': <GiBowArrow />,
  'Epic Boon': <GiSwordsPower />,
};

const categoryOrder = ['Origin', 'General', 'Fighting Style', 'Epic Boon'];

const groupFeatsByCategory = (feats: Feat[]) => {
  const groups: Record<string, Feat[]> = {};

  feats.forEach((feat) => {
    const category = feat.category || 'Other';
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(feat);
  });

  // Sort feats within each category
  Object.keys(groups).forEach((category) => {
    groups[category].sort((a, b) => a.name.localeCompare(b.name));
  });

  return groups;
};

const FeatsIndex = ({ feats, loading, getFeats }: FeatsIndexProps) => {
  const { edition: editionParam, param } = useParams<{ edition?: string; param?: string }>();
  const { edition: contextEdition, isEdition2014 } = useEdition();

  // Use edition from URL if valid (either :edition or :param route), otherwise from context
  const urlEdition = editionParam || param;
  const edition = isValidEdition(urlEdition) ? urlEdition : contextEdition;

  React.useEffect(() => {
    getFeats();
  }, []);

  // Feats are only available in 2024 edition
  if (isEdition2014) {
    return (
      <PageContainer
        pageTitle="Feats"
        description="D&D 5th Edition Feats. Dungeon Master's Toolbox is a free resource for DMs."
      >
        <PageTitle title="Feats" isLegacy />
        <p>
          The structured feats in the SRD are a 2024 edition feature. Switch to the 2024 edition to
          view feats.
        </p>
      </PageContainer>
    );
  }

  const groupedFeats = groupFeatsByCategory(feats);

  return (
    <PageContainer
      pageTitle="Feats"
      description="D&D 5th Edition Feats. Dungeon Master's Toolbox is a free resource for DMs."
    >
      <PageTitle title="Feats" />
      {loading ? (
        <DndSpinner />
      ) : (
        <FeatsContainer>
          {categoryOrder.map((category) => {
            const categoryFeats = groupedFeats[category];
            if (!categoryFeats || categoryFeats.length === 0) return null;

            return (
              <CategorySection key={category}>
                <CategoryTitle>{category} Feats</CategoryTitle>
                <FeatsGrid>
                  {categoryFeats.map((feat) => (
                    <Link key={feat.slug} to={getContentUrl('feats', feat.slug, edition)}>
                      <FeatCard>
                        <FeatCardHeader>
                          <FeatCardIcon>{categoryIcons[category] || <GiUpgrade />}</FeatCardIcon>
                          <FeatCardTitle>{feat.name}</FeatCardTitle>
                          {feat.repeatable && <RepeatableBadge>Repeatable</RepeatableBadge>}
                        </FeatCardHeader>
                        <FeatCardMeta>{category} Feat</FeatCardMeta>
                        {feat.prerequisite && (
                          <FeatCardPrerequisite>
                            <strong>Prerequisite:</strong> {feat.prerequisite}
                          </FeatCardPrerequisite>
                        )}
                      </FeatCard>
                    </Link>
                  ))}
                </FeatsGrid>
              </CategorySection>
            );
          })}
        </FeatsContainer>
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    feats: state.feats.feats,
    loading: state.feats.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFeats: () => {
      dispatch(rest.actions.getFeats());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(FeatsIndex);
