import React from 'react';
import { ConditionProps } from '../../utilities/types';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import rest from '../../api/api';
import { connect } from 'react-redux';

const styles = require('./conditions.module.scss');

const Condition = (props: {
  condition: ConditionProps;
  loading?: boolean;
  conditionSlug: string;
  getCondition: (conditionSlug: string) => void;
}) => {
  const { condition, getCondition, conditionSlug } = props;

  React.useEffect(() => {
    getCondition(conditionSlug);
  }, []);

  const conditionTitle = condition ? condition.name : 'Condition Loading...';

  return (
    <PageContainer
      pageTitle={conditionTitle}
      description={`Condition: ${conditionTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
    >
      {condition ? (
        <div className={styles.condition}>
          <PageTitle title={conditionTitle} />
          <ul className={styles.description}>
            {condition.description.map((desc, index) => (
              <li key={index}>{desc}</li>
            ))}
          </ul>
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    condition: state.conditions.currentCondition,
    loading: state.conditions.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getCondition: (conditionSlug: string) => {
      dispatch(rest.actions.getCondition({ slug: conditionSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Condition);
