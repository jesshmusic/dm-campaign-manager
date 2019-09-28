/**
 * Created by jesshendricks on 9/5/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import {Link} from '@reach/router';
import Badge from 'react-bootstrap/Badge';

const PageTitle = ({hasButton, buttonLink, buttonTitle, buttonVariant, subtitle, title, badge}) => (
  <Row>
    <Col>
      <h1 className={'d-flex justify-content-between align-items-center'}>
        {title}
        {hasButton ? (
          <Link to={buttonLink} className={`btn btn-${buttonVariant}`}>
            {buttonTitle}
          </Link>
        ) : null}
        {badge ? (
          <Badge variant={badge.variant}>
            {badge.title}
          </Badge>
        ) : null}
      </h1>
      {subtitle ? (
        <p className={'h5 text-muted'}>{subtitle}</p>
      ) : null}
    </Col>
  </Row>
);

PageTitle.propTypes = {
  badge: PropTypes.object,
  hasButton: PropTypes.bool,
  buttonLink: PropTypes.string,
  buttonTitle: PropTypes.string,
  buttonVariant: PropTypes.string,
  subtitle: PropTypes.string,
  title: PropTypes.string.isRequired,
};

export default PageTitle;