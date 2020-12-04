/**
 * Created by jesshendricks on 9/13/19
 */

import React, {useState} from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import CopyField from '../../../components/CopyField';
import NameOptions from '../../../components/forms/NameOptions';

const NameField = ({colWidth}) => {
  const [nameValue, setNameValue] = useState('');

  const handleGenerateName = (gender, race) => {
    const apiURL = `/v1/random_fantasy_name?random_npc_gender=${gender}&random_npc_race=${race}`;
    fetch(apiURL)
      .then((response) => response.json())
      .then((jsonResult) => {
        setNameValue(jsonResult.name);
      });
  };

  return (
    <Col md={colWidth}>
      <Row>
        <Col md={'12'}>
          <Form>
            <CopyField placeHolder={'Random Name...'}
                       fieldId={'randomFantasyName'}
                       label={'Random Name'}
                       text={nameValue} />
          </Form>
        </Col>
        <Col md={'12'}>
          <NameOptions onFormSubmit={handleGenerateName} submitText={'Name'}/>
        </Col>
      </Row>
    </Col>
  );
};

NameField.propTypes = {
  colWidth: PropTypes.string.isRequired,
  value: PropTypes.string,
};

export default NameField;