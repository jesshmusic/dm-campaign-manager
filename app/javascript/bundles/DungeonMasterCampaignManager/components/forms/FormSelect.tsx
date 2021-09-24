/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import Col from 'react-bootstrap/Col';
import { Field, FieldRenderProps } from 'react-final-form';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';
import { SelectOption } from '../../utilities/types';

export type SelectProps = {
  colWidth: string;
  defaultOptions?: boolean;
  getOptions?: () => void;
  // input: any;
  isClearable?: boolean;
  isCreatable?: boolean;
  isMulti?: boolean;
  label: string;
  name: string;
  options?: SelectOption[];
  placeholder?: string;
  value?: any;
}

const ReactSelectAdapter = ({ input, isClearable, ...rest }: FieldRenderProps<any>) => (
  <Select
    {...input}
    {...rest}
    defaultValue={input.value}
    isClearable={isClearable}
    searchable />
);

const ReactSelectCreateAdapter = ({ input, isClearable, ...rest }: FieldRenderProps<any>) => (
  <CreatableSelect
    {...input}
    {...rest}
    isClearable={isClearable}
    searchable />
);

const FormSelect = ({
                      name,
                      label,
                      colWidth,
                      isClearable = false,
                      options,
                      isCreatable = false,
                      isMulti = false
                    }: SelectProps) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           label={label}
           options={options}
           isClearable={isClearable}
           isMulti={isMulti}
           component={isCreatable ? ReactSelectCreateAdapter : ReactSelectAdapter} />
  </Form.Group>
);

export default FormSelect;