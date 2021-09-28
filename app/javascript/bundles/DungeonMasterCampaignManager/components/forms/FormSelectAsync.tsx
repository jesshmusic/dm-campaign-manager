/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import AsyncSelect from 'react-select/async';
import { SelectProps } from './FormSelect';
import classNames from 'classnames';

const FormSelectAsync = ({
                           name,
                           label,
                           className,
                           isMulti,
                           getOptions,
                           placeholder,
                           defaultOptions = true,
                           isClearable = false
                         }: SelectProps) => {
  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    setInputValue(inputValue);
    return newValue;
  };

  return (
    <div className={classNames(className, 'mb-3')}>
      <label htmlFor={name} className='form-label'>{label}</label>
      <div>
        <AsyncSelect
          isMulti={isMulti}
          cacheOptions
          defaultOptions={defaultOptions}
          isClearable={isClearable}
          searchable
          onInputChange={handleInputChange}
          loadOptions={getOptions}
        />
      </div>
    </div>
  );
}

export default FormSelectAsync;