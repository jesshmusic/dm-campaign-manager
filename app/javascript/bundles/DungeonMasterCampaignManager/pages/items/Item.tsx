import React from 'react';

import PageContainer from '../../containers/PageContainer';
import rest from '../../actions/api';
import PageTitle from '../../components/PageTitle/PageTitle';
import DndSpinner from '../../components/DndSpinners/DndSpinner';
import { connect } from 'react-redux';

const styles = require('./item.module.scss');

type ItemPageProps = {
  item?: any;
  itemSlug: string;
  getItem: (itemSlug: string) => void;
  loading: boolean;
};

const Item = (props: ItemPageProps) => {
  const { item, itemSlug, getItem, loading } = props;
  React.useEffect(() => {
    getItem(itemSlug);
  }, []);

  const itemTitle = item ? item.name : 'Item Loading...';
  return (
    <PageContainer
      pageTitle={itemTitle}
      description={`Item: ${itemTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      breadcrumbs={[
        { url: '/app/classes', isActive: false, title: 'Character Classes' },
        { isActive: true, title: itemTitle },
      ]}
    >
      <PageTitle title={itemTitle} />
      {item ? (
        <div className={styles.page}>
          <div className={styles.infoSection}>
            <div className={styles.sectionGroup}>
              <h2 className={styles.sectionHeading}>Class Features</h2>
            </div>
          </div>
        </div>
      ) : (
        <DndSpinner />
      )}
    </PageContainer>
  );
};

function mapStateToProps(state) {
  return {
    item: state.items.currentItem,
    loading: state.items.loading,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getDndClass: (itemSlug: string) => {
      dispatch(rest.actions.getItem({ slug: itemSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
