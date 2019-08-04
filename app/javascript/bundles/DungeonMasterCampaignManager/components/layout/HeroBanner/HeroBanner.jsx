import React from 'react';
import PropTypes from 'prop-types';
import axiosClient from '../../../actions/axiosClient';

import styles from './HeroBanner.scss';

const HeroBanner = (props) => (
  <div>
    Hero Banner
  </div>
);

HeroBanner.propTypes = {
  user: PropTypes.object,
};

export default HeroBanner;
