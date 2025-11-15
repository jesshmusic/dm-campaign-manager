/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { GiTwoHandedSword } from 'react-icons/all';

const styles = require('./breadcrumbs.module.scss');

const BreadcrumbLink = (props: { to: string; title: string }) => (
  <li className={styles.breadcrumbItem}>
    {props.to !== '/' && <GiTwoHandedSword />} <Link to={props.to}>{props.title}</Link>
  </li>
);

export default BreadcrumbLink;
