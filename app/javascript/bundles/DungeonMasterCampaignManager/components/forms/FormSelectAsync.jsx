/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import AsyncSelect from 'react-select/async';

class ReactSelectAdapter extends React.Component {
  state = { inputValue: '' };

  handleInputChange = (newValue) => {
    const inputValue = newValue.replace(/\W/g, '');
    this.setState({ inputValue });
    return newValue;
  };

  render () {
    const { input, isMulti, getOptions, defaultOptions, isClearable, ...rest } = this.props;
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
          onInputChange={this.handleInputChange}
          loadOptions={getOptions}
        />
      </div>
    );
  }
}

ReactSelectAdapter.propTypes = {
  input: PropTypes.any,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  getOptions: PropTypes.func.isRequired,
  defaultOptions: PropTypes.any,
};

const FormSelectAsync = ({
  name,
  label,
  colWidth,
  isMulti,
  getOptions,
  placeholder,
  defaultOptions = true,
  isClearable = false
}) => (
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

FormSelectAsync.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  defaultOptions: PropTypes.any,
  getOptions: PropTypes.func.isRequired,
  isClearable: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
};

export default FormSelectAsync;