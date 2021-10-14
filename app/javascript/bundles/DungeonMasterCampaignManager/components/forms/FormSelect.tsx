/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import {
  MonsterGeneratorFormFields,
  SelectOption,
} from '../../utilities/types';
import { Control, Controller } from 'react-hook-form';
import classNames from 'classnames';

export type SelectProps = {
  className?: string;
  defaultOptions?: boolean;
  getOptions?: () => void;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  name: keyof MonsterGeneratorFormFields;
  handleSelectChange?: (name: string, value: string | number) => void;
  options?: SelectOption[];
  placeholder?: string;
  control?: Control<MonsterGeneratorFormFields>;
  value?: any;
};

const styles = require('./input.module.scss');

const FormSelect = ({
  name,
  label,
  className = '',
  isClearable = false,
  handleSelectChange,
  options,
  control,
  isCreatable = false,
  isMulti = false,
}: SelectProps) => {
  const handleChange = (value, onChange) => {
    console.log(value);
    onChange(value);
    if (handleSelectChange) {
      handleSelectChange(name, value.value);
    }
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, onBlur, value, name, ref } }) =>
          isCreatable ? (
            <CreatableSelect
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
              onBlur={onBlur}
              onChange={onChange}
              value={value}
              name={name}
              ref={ref}
            />
          ) : (
            <Select
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
              onBlur={onBlur}
              // @ts-ignore
              value={value}
              onChange={(event) => handleChange(event, onChange)}
              // value={value}
              name={name}
              ref={ref}
            />
          )
        }
      />
    </div>
  );
};

export default FormSelect;
