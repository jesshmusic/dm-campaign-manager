import React from 'react';
import BreadcrumbLink from './BreadcrumbLink';

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
