import React from 'react';

import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { useEdition } from '../../contexts/EditionContext';
import { DndClass } from '../../utilities/types';
import { connect } from 'react-redux';
import HitPointsSection from './components/HitPointsSection';
import ProficienciesSection from './components/ProficienciesSection';
import EquipmentSection from './components/EquipmentSection';
import ClassLevelsTable from './components/ClassLevelsTable';
import FeaturesDesc from './components/FeaturesDesc';
import { useParams } from 'react-router-dom';
import { parseEditionParams } from '../../utilities/editionUrls';

import { Page, InfoSection, SectionGroup, SectionHeading } from './DndClass.styles';

type DndClassPageProps = {
  dndClass?: DndClass;
  getDndClass: (dndClassSlug: string) => void;
};

const DndClassPage = (props: DndClassPageProps) => {
  const { dndClass, getDndClass } = props;
  const params = useParams<{ edition?: string; dndClassSlug?: string; param?: string }>();
  // Handle both /app/classes/:edition/:slug and /app/classes/:param routes
  const { slug: dndClassSlug } = parseEditionParams(
    params.edition,
    params.dndClassSlug || params.param,
  );
  const { isEdition2014 } = useEdition();

  React.useEffect(() => {
    if (dndClassSlug) {
      getDndClass(dndClassSlug);
    }
  }, [dndClassSlug]);

  const dndClassTitle = dndClass ? dndClass.name : 'Class Loading...';

  return (
    <PageContainer
      pageTitle={dndClassTitle}
      description={`DndClass: ${dndClassTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      <PageTitle title={dndClassTitle} isLegacy={isEdition2014} />
      {dndClass ? (
        <Page>
          <InfoSection>
            <SectionGroup>
              <SectionHeading>Class Features</SectionHeading>
              <p>As a {dndClass.name.toLowerCase()}, you gain the following class features.</p>
            </SectionGroup>
            <HitPointsSection dndClass={dndClass} />
            <ProficienciesSection dndClass={dndClass} />
            <EquipmentSection dndClass={dndClass} />
          </InfoSection>
          <ClassLevelsTable dndClass={dndClass} />
          <FeaturesDesc dndClass={dndClass} />
        </Page>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    dndClass: state.dndClasses.currentDndClass,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDndClass: (dndClassSlug: string) => {
      dispatch(rest.actions.getDndClass({ id: dndClassSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClassPage);
