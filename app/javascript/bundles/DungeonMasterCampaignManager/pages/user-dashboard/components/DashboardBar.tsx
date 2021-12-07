import React from 'react';
import AddList from './AddList';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiSave } from 'react-icons/all';

const styles = require('../user-dashboard.module.scss');

const DashboardBar = ({ onLayoutSave, items, onRemoveItem, onAddItem, originalItems }) => {
  return (
    <div className={styles.dashboardHeader}>
      <AddList
        items={items}
        onRemoveItem={onRemoveItem}
        onAddItem={onAddItem}
        originalItems={originalItems}
      />
      <h2>Dashboard</h2>
      <Button
        color={Colors.transparent}
        title={'Save Screen'}
        hideTitle
        icon={<GiSave size={30} />}
        onClick={onLayoutSave}
      />
    </div>
  );
};

export default DashboardBar;
