import React from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Container from 'react-bootstrap/Container';

import Footer from '../components/layout/Footer/Footer.jsx';
import HeroBanner from '../components/layout/HeroBanner/HeroBanner.jsx';
import MenuBar from '../components/layout/MenuBar/MenuBar';
import FlashMessages from '../components/layout/Alerts/FlashMessages.jsx';

import '../stylesheets/_global.scss';
import {Helmet} from 'react-helmet';
import Breadcrumb from 'react-bootstrap/Breadcrumb';
import BreadcrumbLink from '../components/layout/BreadcrumbLink';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

const PageContainer = (props) => {
  const {breadcrumbs, children, description, pageTitle, user} = props;

  return (
    <div>
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Campaign Manager</title>
        <meta name="description" content={description}/>
      </Helmet>
      <MenuBar user={user}/>
      <HeroBanner/>
      <FlashMessages/>
      <Container fluid>
        {breadcrumbs && breadcrumbs.length > 0 ? (
          <Breadcrumb>
            <BreadcrumbLink to='/' title={'Home'}/>
            {breadcrumbs.map((breadcrumb, index) =>
              (!breadcrumb.isActive ? (
                <BreadcrumbLink to={breadcrumb.url} title={breadcrumb.title} key={index}/>
              ) : (
                <Breadcrumb.Item active key={index}>{breadcrumb.title}</Breadcrumb.Item>
              )),
            )}
          </Breadcrumb>
        ) : null}
        <Row>
          <Col>
            {children}
          </Col>
        </Row>
      </Container>
      <Footer user={user}/>
    </div>
  );
};

PageContainer.propTypes = {
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    isActive: PropTypes.bool,
    title: PropTypes.string.isRequired,
    url: PropTypes.string,
  })),
  children: PropTypes.any,
  description: PropTypes.string.isRequired,
  pageTitle: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default PageContainer;
