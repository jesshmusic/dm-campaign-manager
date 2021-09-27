import React from 'react';

const ReadOnlyField = (props: { className?: string, label: string, name: string, value: string | number }) => {
  const { className, label, name, value } = props;
  return (
    <div className={`py-2 ${className}`}>
      <label className='form-label' htmlFor={name}>
        {label}
      </label>
      <input
        className={'form-control'}
        autoComplete={''}
        type={'text'}
        readOnly
        value={value}
      />
    </div>
  );
};

export default ReadOnlyField;