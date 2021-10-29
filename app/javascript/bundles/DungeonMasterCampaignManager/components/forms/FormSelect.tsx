/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from '../../utilities/types';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';
import './inputOverrides.scss';

export type SelectProps = {
  className?: string;
  defaultOptions?: boolean;
  defaultValue?: SelectOption;
  getOptions?: (inputValue: string, callback: any) => void;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
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
  options,
  control,
  isCreatable = false,
  isMulti = false,
}: SelectProps) => {
  return (
    <div className={classNames(className, styles.wrapper)}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
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
