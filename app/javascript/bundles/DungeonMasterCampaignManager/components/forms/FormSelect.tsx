/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from '../../utilities/types';

export type SelectProps = {
  className?: string;
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

const FormSelect = ({
                      name,
                      label,
                      className = '',
                      isClearable = false,
                      options,
                      isCreatable = false,
                      isMulti = false
                    }: SelectProps) => (
  <div className={`py-2 ${className}`}>
    <label htmlFor={name} className='form-label'>{label}</label>
    {isCreatable ? (
      <CreatableSelect
        isClearable={isClearable}
        searchable />
    ) : (
      <Select
        isClearable={isClearable}
        searchable />
    )}
  </div>
);

export default FormSelect;