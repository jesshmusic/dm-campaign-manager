import React from 'react';
import PropTypes from 'prop-types';
import Image from 'react-bootstrap/Image';

const HeroBanner = (props) => {
  const {imagePath} = props;
  return (
    <Image src={imagePath ? imagePath : '/assets/rays-of-sun-through-trees.jpg'} fluid alt={'Rays of Sun Through Trees'} />
  );
};

HeroBanner.propTypes = {
  imagePath: PropTypes.string,
};

export default HeroBanner;
