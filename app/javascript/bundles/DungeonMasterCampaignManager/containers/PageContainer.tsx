import React from 'react';

// Bootstrap
import Footer from '../components/layout/Footer/Footer.jsx';
import HeroBanner from '../components/layout/HeroBanner/HeroBanner';
import MenuBar from '../components/layout/MenuBar/MenuBar';
import FlashMessages from '../components/layout/Alerts/FlashMessages';

import '../stylesheets/_fonts.scss';
import '../stylesheets/application.scss';
import { Helmet } from 'react-helmet';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../components/layout/BreadcrumbLink';

import { FlashMessage, UserProps } from '../utilities/types';
import classNames from 'classnames';

const styles = require('./page-container.module.scss');

type BreadCrumbProps = {
  isActive?: boolean;
  title: string;
  url?: string;
}

type PageContainerProps = {
  breadcrumbs: BreadCrumbProps[];
  children?: React.ReactNode;
  description: string;
  flashMessages?: FlashMessage[];
  pageTitle: string;
  user?: UserProps;
}

const PageContainer = (props: PageContainerProps) => {
  const { breadcrumbs, children, description, pageTitle, user } = props;

  return (
    <div>
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Screen</title>
        <meta name='description' content={description} />
      </Helmet>
      <MenuBar user={user} />
      <HeroBanner />
      <div className={classNames('container-fluid', styles.page)}>
        <FlashMessages messages={props.flashMessages || []} />
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'} />
            {breadcrumbs.map((breadcrumb, index) =>
              (!breadcrumb.isActive ? (
                  <BreadcrumbLink to={breadcrumb.url} title={breadcrumb.title} key={index} />
                ) : (
                  <Breadcrumb.Item active key={index}>{breadcrumb.title}</Breadcrumb.Item>
                )
              )
            )}
          </Breadcrumb>
        ) : null}
        {children}
      </div>
      <Footer user={user} />
    </div>
  );
};

export default PageContainer;
