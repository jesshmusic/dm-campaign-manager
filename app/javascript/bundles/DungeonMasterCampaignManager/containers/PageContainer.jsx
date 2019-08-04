import React from 'react';
import PropTypes from 'prop-types';

import ContentWrapper from '../components/layout/ContentWrapper/ContentWrapper.jsx';
import Footer from '../components/layout/Footer/Footer.jsx';
import HeroBanner from '../components/layout/HeroBanner/HeroBanner.jsx';
import Navbar from '../components/layout/Navbar/Navbar.jsx';

import '../stylesheets/_global.scss';

const PageContainer = (props) => (
  <div>
    <Navbar user={props.user} />
    <ContentWrapper>
      <HeroBanner />
      {props.children}
    </ContentWrapper>
    <Footer user={props.user} />
  </div>
);

PageContainer.propTypes = {
  children: PropTypes.element.isRequired,
  user: PropTypes.object,
};

export default PageContainer;
