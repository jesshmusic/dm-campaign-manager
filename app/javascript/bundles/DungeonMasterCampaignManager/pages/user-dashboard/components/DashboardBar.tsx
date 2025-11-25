import React from 'react';
import AddList from './AddList';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiChecklist } from 'react-icons/gi';
import ReactModal from 'react-modal';

import styles from '../user-dashboard.module.scss';

const DashboardBar = ({ items, onRemoveItem, onAddItem, widgets }) => {
  const [showWidgetList, setShowWidgetList] = React.useState(false);

  ReactModal.setAppElement(document.getElementById('dmsContainer'));

  return (
    <div className={styles.dashboardHeader}>
      <ReactModal
        className={styles.dashboardModal}
        isOpen={showWidgetList}
        contentLabel="Minimal Modal Example"
        onRequestClose={() => setShowWidgetList(false)}
        overlayClassName={styles.dashboardModalOverlay}
        shouldCloseOnOverlayClick={true}
        shouldCloseOnEsc={true}
        parentSelector={() => document.getElementById('dashboardContainer')}
      >
        <AddList
          items={items}
          onRemoveItem={onRemoveItem}
          onAddItem={onAddItem}
          onCloseModal={() => setShowWidgetList(false)}
          widgets={widgets}
        />
      </ReactModal>
      <h2>
        Dashboard <small>(Best viewed on wide screens)</small>
      </h2>
      <div className={styles.buttons}>
        <Button
          className={styles.listButton}
          color={Colors.transparent}
          title={'Select Widgets'}
          icon={<GiChecklist size={30} />}
          onClick={() => setShowWidgetList(true)}
        />
      </div>
    </div>
  );
};

export default DashboardBar;
