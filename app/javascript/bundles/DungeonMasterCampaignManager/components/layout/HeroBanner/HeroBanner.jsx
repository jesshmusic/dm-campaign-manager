import React from 'react';
import PropTypes from 'prop-types';

import classes from './hero-banner.module.scss';

const HeroBanner = (props) => {
  const {imagePath} = props;
  return (
    <div className={classes.heroBanner} style={{backgroundImage: imagePath ? `url(${imagePath})` : 'url(\'/images/rays-of-sun-through-trees.jpg\')'}}/>
  );
};

HeroBanner.propTypes = {
  imagePath: PropTypes.string,
};

export default HeroBanner;
