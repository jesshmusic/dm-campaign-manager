/**
 * Created by jesshendricks on 2019-08-25
 */

import AsyncSelect from 'react-select/async';
import { SelectProps } from './FormSelect';
import { Controller } from 'react-hook-form';

import { FormWrapper, FormLabel } from './Forms.styles';

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
    <FormWrapper className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
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
    </FormWrapper>
  );
};

export default FormSelectAsync;
