import React from 'react';
import ReactGA from 'react-ga4';

import youTubeAd from './YouTubeAd.jpg';
import youTubeAdSmall from './YouTubeAdSmall.jpg';

ReactGA.initialize('G-8XJTH70JSQ');

import styles from './bannerad.module.scss';

const YouTubeAd = () => {
  const handleClick = () => {
    ReactGA.event('YouTube Ad Clicked');
  };
  return (
    <div className={styles.bannerAdContainer}>
      <a
        href="https://www.youtube.com/channel/UCC8ZTZ5nMEuVelHXMJpPeCA"
        target="_blank"
        style={{ textDecoration: 'none' }}
        onClick={handleClick}
        rel="noreferrer"
      >
        <img className={`${styles.bannerImage} ${styles.bannerImageLarge}`} src={youTubeAd} />
        <img className={`${styles.bannerImage} ${styles.bannerImageSmall}`} src={youTubeAdSmall} />
      </a>
    </div>
  );
};

export default YouTubeAd;
