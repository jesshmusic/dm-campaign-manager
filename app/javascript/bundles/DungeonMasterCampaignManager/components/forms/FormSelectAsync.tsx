/**
 * Created by jesshendricks on 2019-08-25
 */

import React, { PropsWithChildren } from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import AsyncSelect from 'react-select/async';
import { SelectProps } from './FormSelect';
import classNames from 'classnames';

const ReactSelectAdapter: React.ComponentType<FieldRenderProps<any>> = (props: PropsWithChildren<FieldRenderProps<any>>) => {

  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (newValue: string) => {
    const inputValue = newValue.replace(/\W/g, '');
    setInputValue(inputValue);
    return newValue;
  };

  const { input, isMulti, getOptions, defaultOptions, isClearable, ...rest } = props;
  return (
    <div>
      <AsyncSelect
        isMulti={isMulti}
        cacheOptions
        defaultOptions={defaultOptions}
        isClearable={isClearable}
        {...input}
        {...rest}
        searchable
        onInputChange={handleInputChange}
        loadOptions={getOptions}
      />
    </div>
  );
};

const FormSelectAsync = ({
                           name,
                           label,
                           className,
                           isMulti,
                           getOptions,
                           placeholder,
                           defaultOptions = true,
                           isClearable = false
                         }: SelectProps) => (
  <div className={classNames(className, 'mb-3')}>
    <label htmlFor={name} className='form-label'>{label}</label>
    <Field name={name}
           defaultOptions={defaultOptions}
           label={label}
           isMulti={isMulti}
           getOptions={getOptions}
           isClearable={isClearable}
           component={ReactSelectAdapter}
           placeholder={placeholder}
    />
  </div>
);

export default FormSelectAsync;