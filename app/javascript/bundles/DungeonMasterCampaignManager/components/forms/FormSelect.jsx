/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';

const ReactSelectAdapter = ({ input, ...rest }) => (
  <Select {...input} {...rest} searchable />
);

const FormSelect = ({name, label, colWidth, options}) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           label={label}
           options={options}
           component={ReactSelectAdapter}/>
  </Form.Group>
);

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default FormSelect;