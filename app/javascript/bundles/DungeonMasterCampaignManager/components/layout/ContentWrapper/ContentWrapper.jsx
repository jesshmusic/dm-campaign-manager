import React from 'react';
import PropTypes from 'prop-types';

const ContentWrapper = ({ children }) => (
  <div className={styles.contentWrapper}>
    {children}
  </div>
);
ContentWrapper.propTypes = {
  children: PropTypes.any,
};

export default ContentWrapper;
