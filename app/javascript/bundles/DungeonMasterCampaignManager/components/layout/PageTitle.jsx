/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Link} from '@reach/router';

const PageTitle = ({hasButton, buttonLink, buttonTitle, buttonVariant, title}) => (
  <Row>
    <Col>
      <h1 className={'d-flex justify-content-between align-items-center'}>
        {title}
        {hasButton ? (
          <Link to={buttonLink} className={`btn btn-${buttonVariant}`}>
            {buttonTitle}
          </Link>
        ) : null}
      </h1>
    </Col>
  </Row>
);

PageTitle.propTypes = {
  hasButton: PropTypes.bool,
  buttonLink: PropTypes.string,
  buttonTitle: PropTypes.string,
  buttonVariant: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default PageTitle;