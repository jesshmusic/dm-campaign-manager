import React from 'react';
import PropTypes from 'prop-types';

// Bootstrap
import Container from 'react-bootstrap/Container';

import Footer from '../components/layout/Footer/Footer.jsx';
import HeroBanner from '../components/layout/HeroBanner/HeroBanner.jsx';
import MenuBar from '../components/layout/MenuBar';
import FlashMessages from '../components/layout/Alerts/FlashMessages.jsx';

import '../stylesheets/_global.scss';

const PageContainer = (props) => {
  const { children, user, flashMessages, pageTitle } = props;

  return (
    <div>
      <MenuBar user={user}/>
      <HeroBanner />
      <FlashMessages messages={flashMessages}/>
      <Container>
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
  pageTitle: PropTypes.string.isRequired,
  user: PropTypes.object,
};

export default PageContainer;
