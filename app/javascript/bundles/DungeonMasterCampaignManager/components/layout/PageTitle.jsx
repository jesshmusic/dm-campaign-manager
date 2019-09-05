/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const PageTitle = ({title}) => (
  <Row>
    <Col>
      <h1>{title}</h1>
    </Col>
  </Row>
);

PageTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default PageTitle;