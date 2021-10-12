import React from 'react';
import BreadcrumbLink from './BreadcrumbLink';
import { navigate } from '@reach/router';
import { GiPointing } from 'react-icons/all';

const styles = require('./breadcrumbs.module.scss');

export type BreadCrumbProps = {
  isActive?: boolean;
  title: string;
  url?: string;
};

const Breadcrumbs = (props: { breadcrumbs: BreadCrumbProps[] }) => {
  const { breadcrumbs } = props;
  return (
    <nav aria-label="breadcrumb">
      <ol className={styles.breadcrumb}>
        <button className={styles.backButton} onClick={() => navigate(-1)}>
          <GiPointing size={25} />
        </button>
        <BreadcrumbLink to="/" title={'Home'} />
        {breadcrumbs.map((breadcrumb, index) =>
          !breadcrumb.isActive && breadcrumb.url ? (
            <BreadcrumbLink
              to={breadcrumb.url}
              title={breadcrumb.title}
              key={index}
            />
          ) : (
            <li className={`${styles.breadcrumbItem} active`} key={index}>
              {breadcrumb.title}
            </li>
          )
        )}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
