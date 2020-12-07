/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import {Field} from 'react-final-form';
import Form from 'react-bootstrap/Form';
import {Button} from 'react-bootstrap';

const removeSmallest = (numbers) => {
  const min = Math.min.apply(null, numbers);

  if(numbers.length > 0) {
    for(let i = 0; i < numbers.length; i = i + 1) {
      if(numbers[i] === min) {
        numbers.splice(i, 1);
        return numbers;
      }
    }
  } else {
    return numbers;
  }
};

const AbilityScoreField = ({
  colWidth,
  defaultValue,
  infoText,
  label,
  name,
  hideRoll,
  readOnly,
}) => {
  const handleRollAbility = (input) => {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    const abilityScore = rolls.reduce((a, b) => a + b, 0);
    input.onChange(abilityScore);
  };

  const handleDropLowestRollAbility = (input) => {
    const rolls = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1,
    ];
    const abilityScore = removeSmallest(rolls).reduce((a, b) => a + b, 0);
    input.onChange(abilityScore);
  };

  return (
    <Form.Group as={ Col } md={ colWidth }>
      <Field name={ name } type={ 'number' }>
        { ({input, meta}) => (
          <div>
            {hideRoll ? (
              <Form.Label>{ label }</Form.Label>
            ) : (
              <Form.Label className={ 'd-flex justify-content-between' }>
                { label }
                <Button variant={ 'primary' }
                        size={ 'sm' }
                        onClick={ () => handleRollAbility(input) }>
                  Roll
                </Button>
                <Button variant={ 'primary' }
                        size={ 'sm' }
                        onClick={ () => handleDropLowestRollAbility(input) }>
                  Roll (hi)
                </Button>
              </Form.Label>
            )}

            <Form.Control
              { ...input }
              autoComplete={ '' }
              type={ 'number' }
              placeholder={ label }
              readOnly={ readOnly }
              defaultValue={ defaultValue }
              isValid={ meta.touched && !meta.invalid }
              isInvalid={ meta.error && meta.touched }
            />
            { infoText ? (
              <Form.Text className="text-muted">
                { infoText }
              </Form.Text>
            ) : null }
            <Form.Control.Feedback type="invalid">{ meta.error }</Form.Control.Feedback>
          </div>
        ) }
      </Field>
    </Form.Group>
  );
};

AbilityScoreField.propTypes = {
  name: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  defaultValue: PropTypes.any,
  infoText: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  hideRoll: PropTypes.bool,
  type: PropTypes.string.isRequired,
  value: PropTypes.any,
};

export default AbilityScoreField;