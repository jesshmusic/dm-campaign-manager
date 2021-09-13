/**
 * Created by jesshendricks on 2019-08-25
 */

import React, {PropsWithChildren} from 'react';
import Col from 'react-bootstrap/Col';
import {Field, FieldRenderProps} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import AsyncSelect from 'react-select/async';
import {ISelectProps} from "../../utilities/types";

const ReactSelectAdapter: React.ComponentType<FieldRenderProps<any>> = (props: PropsWithChildren<FieldRenderProps<any>>) => {

  const [inputValue, setInputValue] = React.useState('');

  const handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    setInputValue(inputValue);
    return newValue;
  };

  const {input, isMulti, getOptions, defaultOptions, isClearable, ...rest} = props;
  return (
    <div>
      <AsyncSelect
        isMulti={isMulti}
        cacheOptions
        defaultOptions={defaultOptions}
        isClearable={isClearable}
        {...input}
        {...rest}
        searchable
        onInputChange={handleInputChange}
        loadOptions={getOptions}
      />
    </div>
  );
}

const FormSelectAsync = ({
                           name,
                           label,
                           colWidth,
                           isMulti,
                           getOptions,
                           placeholder,
                           defaultOptions = true,
                           isClearable = false
                         }: ISelectProps) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           defaultOptions={defaultOptions}
           label={label}
           isMulti={isMulti}
           getOptions={getOptions}
           isClearable={isClearable}
           component={ReactSelectAdapter}
           placeholder={placeholder}
    />
  </Form.Group>
);

export default FormSelectAsync;