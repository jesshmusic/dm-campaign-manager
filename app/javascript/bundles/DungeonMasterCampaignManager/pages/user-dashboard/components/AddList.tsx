import React from 'react';
import { dashboardComponents } from '../Dashboard';
import CloseButton from '../../../components/Button/CloseButton';
const styles = require('../user-dashboard.module.scss');

type AddListProps = {
  items: string[];
  onAddItem: (string) => void;
  onRemoveItem: (string) => void;
  originalItems: string[];
  onCloseModal: () => void;
};

export default function AddList({
  items,
  onRemoveItem,
  onAddItem,
  originalItems,
  onCloseModal,
}: AddListProps) {
  const handleChange = (e) => {
    if (e.target.checked) {
      onAddItem(e.target.name);
    } else {
      onRemoveItem(e.target.name);
    }
  };

  return (
    <div className={styles.addListContent}>
      <div className={styles.heading}>
        <h3>Select Widgets</h3>
        <CloseButton onClick={onCloseModal} />
      </div>
      <div className={styles.content}>
        {originalItems.map((item) => (
          <div className={'form-check'} key={item}>
            <input
              className="form-check-input"
              type={'checkbox'}
              name={item}
              onChange={handleChange}
              checked={items.includes(item)}
            />
            <label className="form-check-label" htmlFor={item}>
              {dashboardComponents[item].title}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
