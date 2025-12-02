/**
 * Created by jesshendricks on 2019-08-21
 */

import React from 'react';
import { Link } from 'react-router-dom';
import { GiTwoHandedSword } from 'react-icons/gi';

import { BreadcrumbItem } from './Breadcrumbs.styles';

const BreadcrumbLink = (props: { to: string; title: string }) => (
  <BreadcrumbItem>
    {props.to !== '/' && <GiTwoHandedSword />} <Link to={props.to}>{props.title}</Link>
  </BreadcrumbItem>
);

export default BreadcrumbLink;
