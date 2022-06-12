/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Select, { components } from 'react-select';
import { Controller } from 'react-hook-form';
import classNames from 'classnames';
import './inputOverrides.scss';
import { SelectProps } from './FormSelect';
import { FixedSizeList as List } from 'react-window';

const styles = require('./input.module.scss');

const OPTION_HEIGHT = 40;
const ROWS = 6;

const MenuList = ({ options, children, getValue }) => {
  const [value] = getValue();
  const initialOffset =
    options.indexOf(value) !== -1
      ? Array.isArray(children) && children.length >= ROWS
        ? options.indexOf(value) >= ROWS
          ? options.indexOf(value) * OPTION_HEIGHT - OPTION_HEIGHT * 5
          : 0
        : 0
      : 0;

  return Array.isArray(children) ? (
    <List
      height={children.length >= ROWS ? OPTION_HEIGHT * ROWS : children.length * OPTION_HEIGHT}
      itemCount={children.length}
      itemSize={OPTION_HEIGHT}
      initialScrollOffset={initialOffset}
    >
      {({ style, index }) => {
        return <div style={style}>{children[index]}</div>;
      }}
    </List>
  ) : (
    <div>{children}</div>
  );
};

const { Option, SingleValue } = components;
const IconOption = (props) => (
  <Option {...props}>
    {props.data.icon}
    {props.data.label}
  </Option>
);

const ValueOption = (props) => (
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
    <div className={classNames(className, styles.wrapper)}>
      <label htmlFor={name} className={styles.label}>
        {label}
      </label>
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
    </div>
  );
};

export default FormIconSelect;
