/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import AsyncSelect from 'react-select/async';
import { SelectProps } from './FormSelect';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';

const styles = require('./input.module.scss');

const FormSelectAsync = ({
                           name,
                           label,
                           className,
                           control,
                           isMulti,
                           getOptions,
                           defaultOptions = true,
                           isClearable = false
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
          <AsyncSelect
            isMulti={isMulti}
            cacheOptions
            defaultOptions={defaultOptions}
            isClearable={isClearable}
            isSearchable
            loadOptions={getOptions}
            {...field}
          />
        }
      />
    </div>
  );
};

export default FormSelectAsync;
