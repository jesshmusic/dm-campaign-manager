import React from 'react';

// Container
import PageContainer from '../../containers/PageContainer';
import rest from '../../actions/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { DndClass } from '../../utilities/types';
import { connect } from 'react-redux';
import HitPointsSection from './components/HitPointsSection';
import ProficienciesSection from './components/ProficienciesSection';
import EquipmentSection from './components/EquipmentSection';
import ClassLevelsTable from './components/ClassLevelsTable';
import FeaturesDesc from './components/FeaturesDesc';

const styles = require('./dnd-class.module.scss');

type DndClassPageProps = {
  dndClass?: DndClass;
  dndClassSlug: string;
  getDndClass: (dndClassSlug: string) => void;
};

const DndClass = (props: DndClassPageProps) => {
  const { dndClass, dndClassSlug, getDndClass } = props;

  React.useEffect(() => {
    getDndClass(dndClassSlug);
  }, []);

  const dndClassTitle = dndClass ? dndClass.name : 'Class Loading...';

  return (
    <PageContainer
      pageTitle={dndClassTitle}
      description={`DndClass: ${dndClassTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      breadcrumbs={[
        { url: '/app/classes', isActive: false, title: 'Character Classes' },
        { isActive: true, title: dndClassTitle },
      ]}
    >
      <PageTitle title={dndClassTitle} />
      {dndClass ? (
        <div className={styles.page}>
          <div className={styles.infoSection}>
            <div className={styles.sectionGroup}>
              <h2 className={styles.sectionHeading}>Class Features</h2>
              <p>
                As a {dndClass.name.toLowerCase()}, you gain the following class
                features.
              </p>
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
      dispatch(rest.actions.getDndClass({ slug: dndClassSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(DndClass);
