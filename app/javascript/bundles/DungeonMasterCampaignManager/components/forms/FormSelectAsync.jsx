/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import AsyncSelect from 'react-select/async';

const ReactSelectAdapter = ({ input, isMulti, getOptions, ...rest }) => (
  <AsyncSelect
    isMulti={isMulti}
    cacheOptions
    defaultOptions
    {...input}
    {...rest}
    searchable
    loadOptions={getOptions}
  />
);

const FormSelectAync = ({name, label, colWidth, isMulti, getOptions}) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           label={label}
           isMulti={isMulti}
           getOptions={getOptions}
           component={ReactSelectAdapter}/>
  </Form.Group>
);

FormSelectAync.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  getOptions: PropTypes.func.isRequired,
};

export default FormSelectAync;