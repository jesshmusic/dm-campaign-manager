/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import AsyncSelect from 'react-select/async';
import { SelectProps } from './FormSelect';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';

import styles from './input.module.scss';

// @TODO: Handle required errors
const FormSelectAsync = ({
  name,
  label,
  className,
  control,
  isMulti,
  getOptions,
  required = false,
  defaultOptions = true,
  isClearable = false,
  menuPlacement = 'auto',
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
        render={({ field }) => (
          <AsyncSelect
            className={'reactSelect'}
            classNamePrefix={'reactSelect'}
            isMulti={isMulti}
            cacheOptions
            defaultOptions={defaultOptions}
            isClearable={isClearable}
            isSearchable
            loadOptions={getOptions}
            menuPlacement={menuPlacement}
            {...field}
          />
        )}
      />
    </div>
  );
};

export default FormSelectAsync;
