import React from 'react';

import PageContainer from '../../containers/PageContainer';
import rest from '../../api/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { DndClass } from '../../utilities/types';
import { connect } from 'react-redux';
import HitPointsSection from './components/HitPointsSection';
import ProficienciesSection from './components/ProficienciesSection';
import EquipmentSection from './components/EquipmentSection';
import ClassLevelsTable from './components/ClassLevelsTable';
import FeaturesDesc from './components/FeaturesDesc';
import { useParams } from 'react-router-dom';

import styles from './dnd-class.module.scss';

type DndClassPageProps = {
  dndClass?: DndClass;
  getDndClass: (dndClassSlug: string) => void;
};

const DndClass = (props: DndClassPageProps) => {
  const { dndClass, getDndClass } = props;
  const { dndClassSlug } = useParams<'dndClassSlug'>();

  React.useEffect(() => {
    getDndClass(dndClassSlug!);
  }, [dndClassSlug]);

  const dndClassTitle = dndClass ? dndClass.name : 'Class Loading...';

  return (
    <PageContainer
      pageTitle={dndClassTitle}
      description={`DndClass: ${dndClassTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      <PageTitle title={dndClassTitle} />
      {dndClass ? (
        <div className={styles.page}>
          <div className={styles.infoSection}>
            <div className={styles.sectionGroup}>
              <h2 className={styles.sectionHeading}>Class Features</h2>
              <p>As a {dndClass.name.toLowerCase()}, you gain the following class features.</p>
            </div>
            <HitPointsSection dndClass={dndClass} />
            <ProficienciesSection dndClass={dndClass} />
            <EquipmentSection dndClass={dndClass} />
          </div>
          <ClassLevelsTable dndClass={dndClass} />
          <FeaturesDesc dndClass={dndClass} />
        </div>
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

export default connect(mapStateToProps, mapDispatchToProps)(DndClass);
