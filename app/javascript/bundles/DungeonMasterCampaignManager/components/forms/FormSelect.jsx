/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import Select from 'react-select';
import CreatableSelect from 'react-select/creatable';

const ReactSelectAdapter = ({input, isClearable, ...rest}) => (
  <Select
    {...input}
    {...rest}
    isClearable={isClearable}
    searchable/>
);
ReactSelectAdapter.propTypes = {
  input: PropTypes.object.isRequired,
  isClearable: PropTypes.bool,
};

const ReactSelectCreateAdapter = ({input, isClearable, ...rest}) => (
  <CreatableSelect
    {...input}
    {...rest}
    isClearable={isClearable}
    searchable/>
);
ReactSelectCreateAdapter.propTypes = {
  input: PropTypes.object.isRequired,
  isClearable: PropTypes.bool,
};

const FormSelect = ({name, label, colWidth, isClearable = false, options, isCreateable = false, isMulti = false}) => (
  <Form.Group as={Col} md={colWidth}>
    <Form.Label>{label}</Form.Label>
    <Field name={name}
           label={label}
           options={options}
           isClearable={isClearable}
           isMulti={isMulti}
           component={isCreateable ? ReactSelectCreateAdapter : ReactSelectAdapter}/>
  </Form.Group>
);

FormSelect.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  isClearable: PropTypes.bool,
  isCreateable: PropTypes.bool,
  isMulti: PropTypes.bool,
  label: PropTypes.string.isRequired,
  options: PropTypes.array.isRequired,
};

export default FormSelect;



// class ReactSelectCreateAdapter extends React.Component {
//
//   render() {
//     const {input, isClearable, ...rest} = this.props;
//
//     return (
//       <CreatableSelect
//         {...input}
//         {...rest}
//         isClearable={isClearable}
//         searchable/>
//     );
//   }
// }