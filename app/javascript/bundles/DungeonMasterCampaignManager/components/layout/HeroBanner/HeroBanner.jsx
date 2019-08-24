import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';

import classes from './hero-banner.module.scss';

const HeroBanner = (props) => {
  const {imagePath} = props;
  return (
    <Image src={'/assets/rays-of-sun-through-trees.jpg'}/>
  );
};

HeroBanner.propTypes = {
  imagePath: PropTypes.string,
};

export default HeroBanner;
