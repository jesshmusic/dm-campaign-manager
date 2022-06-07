import React from 'react';
import AddList from './AddList';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiChecklist, GiSave } from 'react-icons/all';
import ReactModal from 'react-modal';

const styles = require('../user-dashboard.module.scss');

const DashboardBar = ({ onLayoutSave, items, onRemoveItem, onAddItem, originalItems }) => {
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
          originalItems={originalItems}
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
        <Button
          className={styles.saveButton}
          color={Colors.transparent}
          title={'Save Layout'}
          icon={<GiSave size={30} />}
          onClick={onLayoutSave}
        />
      </div>
    </div>
  );
};

export default DashboardBar;
