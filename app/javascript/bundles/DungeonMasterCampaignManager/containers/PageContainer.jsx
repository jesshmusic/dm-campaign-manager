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

const PageContainer = (props) => {
  const { children, description, user, flashMessages, pageTitle } = props;

  return (
    <div>
      <Helmet>
        <title>{pageTitle} | Dungeon Master&apos;s Campaign Manager</title>
        <meta name="description" content={description} />
      </Helmet>
      <MenuBar user={user}/>
      <HeroBanner />
      <FlashMessages messages={flashMessages}/>
      <Container fluid={props.fluid}>
        <h1>{pageTitle}</h1>
        {children}
      </Container>
      <Footer user={user} />
    </div>
  );
};

PageContainer.propTypes = {
  children: PropTypes.element,
  flashMessages: PropTypes.array,
  fluid: PropTypes.bool,
  pageTitle: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default PageContainer;
