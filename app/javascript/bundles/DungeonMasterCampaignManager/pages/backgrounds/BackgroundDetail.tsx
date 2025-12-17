import React from 'react';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import rest from '../../api/api';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { Background } from '../../reducers/backgrounds';

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
  getBackground: (slug: string) => void;
};

const BackgroundDetail = ({ currentBackground, loading, getBackground }: BackgroundDetailProps) => {
  const { backgroundSlug } = useParams<{ backgroundSlug: string }>();
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    if (backgroundSlug) {
      getBackground(backgroundSlug);
    }
  }, [backgroundSlug]);

  if (isEdition2014) {
    return (
      <PageContainer pageTitle="Background" description="D&D 5th Edition Character Background.">
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
      <PageContainer pageTitle="Background" description="D&D 5th Edition Character Background.">
        <DndSpinner />
      </PageContainer>
    );
  }

  return (
    <PageContainer
      pageTitle={currentBackground.name}
      description={`${currentBackground.name} - D&D 5th Edition Character Background`}
    >
      <PageTitle title={currentBackground.name} />

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
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    currentBackground: state.backgrounds.currentBackground,
    loading: state.backgrounds.currentBackgroundLoading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getBackground: (slug: string) => {
      dispatch(rest.actions.getBackground({ id: slug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(BackgroundDetail);
