/**
 * Created by jesshendricks on 9/15/19
 */

import React from 'react';

import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import Col from 'react-bootstrap/Col';

const DndSpinner = () => {
  return (
    <Row>
      <Col xs={{span: 2, offset: 5}}>
        <Spinner animation="border" variant="primary">
          <span className="sr-only">Loading...</span>
        </Spinner>
      </Col>
    </Row>
  );
};

export default DndSpinner;