import React from 'react';
import { dashboardComponents } from '../UserDashboard';

export default function AddList({ items, onRemoveItem, onAddItem, originalItems }) {
  const handleChange = (e) => {
    if (e.target.checked) {
      onAddItem(e.target.name);
    } else {
      onRemoveItem(e.target.name);
    }
  };

  return (
    <div>
      <label>Select Widgets</label>
      <div>
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
