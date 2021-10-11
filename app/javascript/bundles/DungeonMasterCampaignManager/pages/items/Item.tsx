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

const getItemParentInfo = (item): { name: string; url: string } => {
  switch (item.category) {
    case 'Armor Item':
      return { name: 'Armor', url: '/app/items/armor' };
    case 'Weapon Item':
      return { name: 'Weapons', url: '/app/items/weapons' };
    case 'Gear Item':
      return { name: 'Adventuring Gear', url: '/app/items/gear' };
    case 'Vehicle Item':
      return { name: 'Mounts & Vehicles', url: '/app/items/vehicles' };
    case 'Magic Item':
      return { name: 'Magic Items', url: '/app/items/magic-items' };
    case 'Magic Armor Item':
      return { name: 'Magic Armor', url: '/app/items/magic-armor' };
    case 'Magic Weapon Item':
      return { name: 'Magic Weapons', url: '/app/items/magic-weapons' };
    case 'Tool Item':
      return { name: 'Tools', url: '/app/items/tools' };
    default:
      return { name: 'All Items', url: '/app/items' };
  }
};

const Item = (props: ItemPageProps) => {
  const { item, itemSlug, getItem, loading } = props;
  React.useEffect(() => {
    getItem(itemSlug);
  }, []);

  const itemTitle = item ? item.name : 'Item Loading...';
  const itemInfo = item ? getItemParentInfo(item) : null;
  return (
    <PageContainer
      pageTitle={itemTitle}
      description={`Item: ${itemTitle}. Dungeon Master's Toolbox is a free resource for DMs to manage their dndClasses, adventures, and Monsters.`}
      breadcrumbs={[
        { url: '/app/items', isActive: false, title: 'Items & Equipment' },
        {
          url: itemInfo ? itemInfo.url : '',
          isActive: false,
          title: itemInfo ? itemInfo.name : '',
        },
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
    getItem: (itemSlug: string) => {
      dispatch(rest.actions.getItem({ slug: itemSlug }));
    },
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Item);
