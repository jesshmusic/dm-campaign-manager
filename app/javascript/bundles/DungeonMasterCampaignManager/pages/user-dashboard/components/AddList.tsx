import React from 'react';
import CloseButton from '../../../components/Button/CloseButton';

import { AddListContent, AddListHeading, AddListContentInner } from '../UserDashboard.styles';

type AddListProps = {
  widgets: { title: string; key: string; icon: React.ElementType }[];
  items: string[];
  onAddItem: (key: string) => void;
  onRemoveItem: (key: string) => void;
  onCloseModal: () => void;
};

export default function AddList({
  items,
  onRemoveItem,
  onAddItem,
  widgets,
  onCloseModal,
}: AddListProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      onAddItem(e.target.name);
    } else {
      onRemoveItem(e.target.name);
    }
  };

  return (
    <AddListContent>
      <AddListHeading>
        <h3>Select Widgets</h3>
        <CloseButton onClick={onCloseModal} />
      </AddListHeading>
      <AddListContentInner>
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
              <>
                {widget.icon}&nbsp;
                {widget.title}
              </>
            </label>
          </div>
        ))}
      </AddListContentInner>
    </AddListContent>
  );
}
