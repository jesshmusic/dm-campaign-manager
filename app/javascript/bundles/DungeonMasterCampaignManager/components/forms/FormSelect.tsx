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
  onChange?: (
    name: keyof MonsterGeneratorFormFields,
    value: string | number
  ) => void;
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
        render={({
          field: { onChange, onBlur, value, name, ref },
          fieldState: { invalid, isTouched, isDirty, error },
          formState,
        }) =>
          isCreatable ? (
            <CreatableSelect
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
            />
          ) : (
            <Select
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
            />
          )
        }
      />
    </div>
  );
};

export default FormSelect;
