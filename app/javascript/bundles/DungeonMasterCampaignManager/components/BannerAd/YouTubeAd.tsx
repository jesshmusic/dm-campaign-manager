import React from 'react';
import ReactGA from 'react-ga4';

import youTubeAd from './YouTubeAd.jpg';
import youTubeAdSmall from './YouTubeAdSmall.jpg';

ReactGA.initialize('G-8XJTH70JSQ');

import { BannerAdContainer, BannerImageLarge, BannerImageSmall } from './BannerAd.styles';

const YouTubeAd = () => {
  const handleClick = () => {
    ReactGA.event('YouTube Ad Clicked');
  };
  return (
    <BannerAdContainer>
      <a
        href="https://www.youtube.com/channel/UCC8ZTZ5nMEuVelHXMJpPeCA"
        target="_blank"
        style={{ textDecoration: 'none' }}
        onClick={handleClick}
        rel="noreferrer"
      >
        <BannerImageLarge src={youTubeAd} />
        <BannerImageSmall src={youTubeAdSmall} />
      </a>
    </BannerAdContainer>
  );
};

export default YouTubeAd;
