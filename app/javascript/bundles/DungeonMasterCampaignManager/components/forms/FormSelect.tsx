/**
 * Created by jesshendricks on 2019-08-25
 */

import Select, { MenuPlacement, Options } from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from '../../utilities/types';
import { Control, Controller, FieldValues } from 'react-hook-form';
import './inputOverrides.scss';

import { FormWrapper, FormLabel } from './Forms.styles';

// @TODO: Handle required errors
export type SelectProps = {
  className?: string;
  defaultOptions?: boolean;
  defaultValue?: SelectOption;
  getOptions?: (inputValue: string, callback: unknown) => void;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  menuPlacement?: MenuPlacement | undefined;
  name: string;
  options?: SelectOption[] | Options<unknown>;
  placeholder?: string;
  required?: boolean;
  control?: Control<FieldValues>;
  value?: unknown;
};

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
  isMulti = false,
}: SelectProps) => {
  return (
    <FormWrapper className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
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
    </FormWrapper>
  );
};

export default FormSelect;
