import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { GiPerson } from 'react-icons/gi';
import { Background } from '../../reducers/backgrounds';

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
  getBackgrounds: () => void;
};

const BackgroundsIndex = ({ backgrounds, loading, getBackgrounds }: BackgroundsIndexProps) => {
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    getBackgrounds();
  }, []);

  // Backgrounds are only available in 2024 edition
  if (isEdition2014) {
    return (
      <PageContainer
        pageTitle="Backgrounds"
        description="D&D 5th Edition Character Backgrounds. Dungeon Master's Toolbox is a free resource for DMs."
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
      pageTitle="Backgrounds"
      description="D&D 5th Edition Character Backgrounds. Dungeon Master's Toolbox is a free resource for DMs."
    >
      <PageTitle title="Backgrounds" />
      {loading ? (
        <DndSpinner />
      ) : (
        <BackgroundsGrid>
          {backgrounds.map((background) => (
            <Link key={background.slug} to={`/app/backgrounds/${background.slug}`}>
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
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    backgrounds: state.backgrounds.backgrounds,
    loading: state.backgrounds.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getBackgrounds: () => {
      dispatch(rest.actions.getBackgrounds());
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundsIndex);
