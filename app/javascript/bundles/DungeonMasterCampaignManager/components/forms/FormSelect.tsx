/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Select, { MenuPlacement } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from '../../utilities/types';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';
import './inputOverrides.scss';

// @TODO: Handle required errors
export type SelectProps = {
  className?: string;
  defaultOptions?: boolean;
  defaultValue?: SelectOption;
  getOptions?: (inputValue: string, callback: any) => void;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  menuPlacement?: MenuPlacement | undefined;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
  required?: boolean;
  control?: Control<any>;
  value?: any;
};

const styles = require('./input.module.scss');

const FormSelect = ({
                      name,
                      label,
                      className = '',
                      defaultValue,
                      isClearable = false,
                      menuPlacement = 'auto',
                      options,
                      control,
                      required = false,
                      isCreatable = false,
                      isMulti = false
                    }: SelectProps) => {
  return (
    <div className={classNames(className, styles.wrapper)}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: 'Please select an option' } : undefined}
        render={({ field }) =>
          isCreatable ? (
            <CreatableSelect
              className={'reactSelect'}
              classNamePrefix={'reactSelect'}
              defaultValue={defaultValue}
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
              menuPlacement={menuPlacement}
              {...field}
            />
          ) : (
            <Select
              className={'reactSelect'}
              classNamePrefix={'reactSelect'}
              defaultValue={defaultValue}
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              menuPlacement={menuPlacement}
              isSearchable
              {...field}
            />
          )
        }
      />
    </div>
  );
};

export default FormSelect;
