/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

const ReactSelectAdapter = ({ input, isClearable, ...rest }) => (
  <Select
    {...input}
    {...rest}
    isClearable={isClearable}
    searchable />
);

const FormSelect = ({name, label, colWidth, isClearable = false, options}) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           label={label}
           options={options}
           isClearable={isClearable}
           component={ReactSelectAdapter}/>
  </Form.Group>
);

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default FormSelect;