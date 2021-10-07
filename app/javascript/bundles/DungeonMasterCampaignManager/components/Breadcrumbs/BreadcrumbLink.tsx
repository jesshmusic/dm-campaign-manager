/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import { Link } from '@reach/router';

const styles = require('./breadcrumbs.module.scss');

const BreadcrumbLink = (props: { to: string; title: string }) => (
  <li className={styles.breadcrumbItem}>
    <Link to={props.to}>{props.title}</Link>
  </li>
);

export default BreadcrumbLink;
