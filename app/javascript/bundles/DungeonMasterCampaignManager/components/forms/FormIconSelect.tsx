/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Select, {
  components,
  MenuListProps as ReactSelectMenuListProps,
  OptionProps,
  SingleValueProps,
} from 'react-select';
import { Controller } from 'react-hook-form';
import './inputOverrides.scss';
import { SelectProps } from './FormSelect';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import { FormWrapper, FormLabel } from './Forms.styles';

type IconOptionType = {
  value: string;
  label: string;
  icon?: React.ReactNode;
};

const OPTION_HEIGHT = 40;
const ROWS = 6;

const MenuList = ({ options, children, getValue }: ReactSelectMenuListProps<IconOptionType>) => {
  const [value] = getValue();
  const initialOffset =
    options.indexOf(value) !== -1
      ? Array.isArray(children) && children.length >= ROWS
        ? options.indexOf(value) >= ROWS
          ? options.indexOf(value) * OPTION_HEIGHT - OPTION_HEIGHT * 5
          : 0
        : 0
      : 0;

  if (!Array.isArray(children)) {
    return <div>{children}</div>;
  }

  return (
    <FixedSizeList
      height={children.length >= ROWS ? OPTION_HEIGHT * ROWS : children.length * OPTION_HEIGHT}
      itemCount={children.length}
      itemSize={OPTION_HEIGHT}
      initialScrollOffset={initialOffset}
      width="100%"
    >
      {({ style, index }: ListChildComponentProps) => {
        return <div style={style}>{children[index]}</div>;
      }}
    </FixedSizeList>
  );
};

const { Option, SingleValue } = components;
const IconOption = (props: OptionProps<IconOptionType>) => (
  <Option {...props}>
    {props.data.icon}
    {props.data.label}
  </Option>
);

const ValueOption = (props: SingleValueProps<IconOptionType>) => (
  <SingleValue {...props}>
    {props.data.icon}
    {props.data.label}
  </SingleValue>
);

const FormIconSelect = ({
  name,
  label,
  className = '',
  defaultValue,
  isClearable = false,
  menuPlacement = 'auto',
  options,
  control,
  required = false,
}: SelectProps) => {
  return (
    <FormWrapper className={className}>
      <FormLabel htmlFor={name}>{label}</FormLabel>
      <Controller
        control={control}
        name={name}
        rules={required ? { required: 'Please select an option' } : undefined}
        render={({ field }) => (
          <Select
            className={'reactSelect'}
            classNamePrefix={'reactSelect'}
            defaultValue={defaultValue}
            isClearable={isClearable}
            options={options}
            isMulti={false}
            menuPlacement={menuPlacement}
            isSearchable
            components={{
              MenuList,
              Option: IconOption,
              SingleValue: ValueOption,
            }}
            {...field}
          />
        )}
      />
    </FormWrapper>
  );
};

export default FormIconSelect;
