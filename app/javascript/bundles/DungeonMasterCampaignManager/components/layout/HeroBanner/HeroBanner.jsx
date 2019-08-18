import React from 'react';
import PropTypes from 'prop-types';

import styles from './hero-banner';

const HeroBanner = (props) => (
  <div className={styles.heroBanner}>
    Hero Banner
  </div>
);

HeroBanner.propTypes = {
  user: PropTypes.object,
};

export default HeroBanner;
