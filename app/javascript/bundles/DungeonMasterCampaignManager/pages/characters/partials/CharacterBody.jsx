/**
 * Created by jesshendricks on 9/8/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

const CharacterBody = ({character}) => {
  return (
    <Row>
      <Col>
        {character.name}, {character.classes}
      </Col>
    </Row>
  );
};

CharacterBody.propTypes = {
  character: PropTypes.object.isRequired
};

export default CharacterBody;