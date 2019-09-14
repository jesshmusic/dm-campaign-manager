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
    return inputValue;
  };

  render () {
    const { input, isMulti, getOptions, ...rest } = this.props;
    return (
      <div>
        <AsyncSelect
          isMulti={isMulti}
          cacheOptions
          defaultOptions
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
  isMulti: PropTypes.bool,
  getOptions: PropTypes.func.isRequired,
};

const FormSelectAsync = ({name, label, colWidth, isMulti, getOptions}) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           label={label}
           isMulti={isMulti}
           getOptions={getOptions}
           component={ReactSelectAdapter}/>
  </Form.Group>
);

FormSelectAsync.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  isMulti: PropTypes.bool,
  getOptions: PropTypes.func.isRequired,
};

export default FormSelectAsync;