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
  handleSelectChange: (name: string, value: string | number) => void;
  options?: SelectOption[];
  placeholder?: string;
  control?: Control<MonsterGeneratorFormFields>;
  value?: any;
};

const styles = require('./input.module.scss');
import './inputOverrides.scss';

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
  const handleChange = (value) => {
    handleSelectChange(name, value.value);
  };

  return (
    <div className={classNames(className, styles.wrapper)}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, ...rest } }) =>
          isCreatable ? (
            <CreatableSelect
              className={'reactSelect'}
              classNamePrefix={'reactSelect'}
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
              onChange={handleChange}
              {...rest}
            />
          ) : (
            <Select
              className={'reactSelect'}
              classNamePrefix={'reactSelect'}
              isClearable={isClearable}
              options={options}
              isMulti={isMulti}
              isSearchable
              onChange={handleChange}
              {...rest}
            />
          )
        }
      />
    </div>
  );
};

export default FormSelect;
