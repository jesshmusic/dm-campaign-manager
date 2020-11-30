/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import {Field} from 'react-final-form';
import Col from 'react-bootstrap/Col';
import ButtonGroup from 'react-bootstrap/ButtonGroup';

const NameFormField = ({colWidth, handleGenerateName, values}) => {
  return (
    <Form.Group as={ Col } md={ colWidth }>
      <Field name={ 'name' } type={ 'text' }>
        { ({input, meta}) => (
          <div>
            <Form.Label>Name</Form.Label>
            <Form.Control
              { ...input }
              autoComplete={ '' }
              type={ 'text' }
              placeholder={ 'NPC name' }
              isValid={ meta.touched && !meta.invalid }
              isInvalid={ meta.error && meta.touched }
            />
            <div className="d-flex flex-column">
              <ButtonGroup className={ 'mt-1' } size="sm">
                <Button
                  variant={ 'primary' }
                  onClick={ () => handleGenerateName('male', values.monsterSubtype, (jsonName) => {
                    input.onChange(jsonName);
                  }) }>
                  Random Name
                </Button>
                <Button
                  variant={ 'secondary' }
                  onClick={ () => handleGenerateName('male', values.monsterSubtype, (jsonName) => {
                    input.onChange(jsonName);
                  }) }>
                  Male
                </Button>
                <Button
                  variant={ 'success' }
                  onClick={ () => handleGenerateName('female', values.monsterSubtype, (jsonName) => {
                    input.onChange(jsonName);
                  }) }>
                  Female
                </Button>
              </ButtonGroup>
            </div>
            <Form.Control.Feedback type="invalid">{ meta.error }</Form.Control.Feedback>
          </div>
        ) }
      </Field>
    </Form.Group>
  );
}

NameFormField.propTypes = {
  colWidth: PropTypes.string.isRequired,
  handleGenerateName: PropTypes.func.isRequired,
  value: PropTypes.string,
  values: PropTypes.any,
};

export default NameFormField;