/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Link } from '@reach/router';

const BreadcrumbLink = ({to, title}) => (
  <li className={'breadcrumb-item'}>
    <Link to={to}>{title}</Link>
  </li>
);

BreadcrumbLink.propTypes = {
  title: PropTypes.string.isRequired,
  to: PropTypes.string.isRequired,
};

export default BreadcrumbLink;