/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import { Field, FieldRenderProps } from 'react-final-form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from '../../utilities/types';
import classNames from 'classnames';

export type SelectProps = {
  className?: string;
  colWidth: string;
  defaultOptions?: boolean;
  getOptions?: () => void;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
  value?: any;
}

const ReactSelectAdapter = ({ input, isClearable, ...rest }: FieldRenderProps<any>) => (
  <Select
    {...input}
    {...rest}
    defaultValue={input.value}
    isClearable={isClearable}
    searchable />
);

const ReactSelectCreateAdapter = ({ input, isClearable, ...rest }: FieldRenderProps<any>) => (
  <CreatableSelect
    {...input}
    {...rest}
    isClearable={isClearable}
    searchable />
);

const FormSelect = ({
                      name,
                      label,
                      className = '',
                      isClearable = false,
                      options,
                      isCreatable = false,
                      isMulti = false
                    }: SelectProps) => (
  <div className={classNames(className, 'mb-3')}>
    <label htmlFor={name} className='form-label'>{label}</label>
    <Field name={name}
           label={label}
           options={options}
           isClearable={isClearable}
           isMulti={isMulti}
           component={isCreatable ? ReactSelectCreateAdapter : ReactSelectAdapter} />
  </div>
);

export default FormSelect;