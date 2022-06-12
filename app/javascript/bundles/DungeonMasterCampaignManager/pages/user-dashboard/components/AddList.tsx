import React from 'react';
import CloseButton from '../../../components/Button/CloseButton';

const styles = require('../user-dashboard.module.scss');

type AddListProps = {
  widgets: { title: string; key: string }[];
  items: string[];
  onAddItem: (string) => void;
  onRemoveItem: (string) => void;
  onCloseModal: () => void;
};

export default function AddList({
  items,
  onRemoveItem,
  onAddItem,
  widgets,
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
        {widgets.map((widget) => (
          <div className={'form-check'} key={widget.key}>
            <input
              className="form-check-input"
              type={'checkbox'}
              name={widget.key}
              onChange={handleChange}
              checked={items.includes(widget.key)}
            />
            <label className="form-check-label" htmlFor={widget.key}>
              {widget.title}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}
