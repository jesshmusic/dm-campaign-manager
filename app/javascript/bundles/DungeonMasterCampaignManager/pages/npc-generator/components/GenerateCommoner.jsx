import Card from 'react-bootstrap/Card';
import NameOptions from '../../../components/forms/NameOptions';
import PropTypes from 'prop-types';
import React from 'react';

const GenerateCommoner = (props) => {
  return <Card className={ 'mb-5' }>
    <Card.Body>
      <Card.Title>Generate Commoner</Card.Title>
      <Card.Subtitle>Quick generate a random commoner</Card.Subtitle>
      <NameOptions onFormSubmit={ props.onFormSubmit } submitText={ 'Commoner' }/>
    </Card.Body>
  </Card>;
};

GenerateCommoner.propTypes = {
  onFormSubmit: PropTypes.func,
};

export default GenerateCommoner;