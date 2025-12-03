import React from 'react';
import AddList from './AddList';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import { GiChecklist } from 'react-icons/gi';
import { MdRefresh } from 'react-icons/md';
import ReactModal from 'react-modal';

import { DashboardHeader, Buttons } from '../UserDashboard.styles';

const DashboardBar = ({ items, onRemoveItem, onAddItem, onResetLayout, widgets }) => {
  const [showWidgetList, setShowWidgetList] = React.useState(false);

  ReactModal.setAppElement(document.getElementById('dmsContainer'));

  return (
    <DashboardHeader>
      <ReactModal
        className="dashboard-modal"
        isOpen={showWidgetList}
        contentLabel="Minimal Modal Example"
        onRequestClose={() => setShowWidgetList(false)}
        overlayClassName="dashboard-modal-overlay"
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
      <Buttons>
        <Button
          color={Colors.transparent}
          title={'Select Widgets'}
          icon={<GiChecklist size={30} />}
          onClick={() => setShowWidgetList(true)}
        />
        <Button
          color={Colors.transparent}
          title={'Reset Layout'}
          icon={<MdRefresh size={30} />}
          onClick={onResetLayout}
        />
      </Buttons>
    </DashboardHeader>
  );
};

export default DashboardBar;
