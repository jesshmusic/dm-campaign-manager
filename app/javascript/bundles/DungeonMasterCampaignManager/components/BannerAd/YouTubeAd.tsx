import React from 'react';
import ReactGA from 'react-ga4';

const youTubeAd = require('./YouTubeAd.jpg');
const youTubeAdSmall = require('./YouTubeAdSmall.jpg');

ReactGA.initialize('G-8XJTH70JSQ');

const styles = require('./bannerad.module.scss');

const YouTubeAd = () => {
  const handleClick = () => {
    console.log('YouTube Ad Clicked');
    ReactGA.event('YouTube Ad Clicked');
  };
  return (
    <div className={styles.bannerAdContainer}>
      <a
        href="https://www.youtube.com/channel/UCC8ZTZ5nMEuVelHXMJpPeCA"
        target="_blank"
        style={{ textDecoration: 'none' }}
        onClick={handleClick}
      >
        <img className={`${styles.bannerImage} ${styles.bannerImageLarge}`} src={youTubeAd} />
        <img className={`${styles.bannerImage} ${styles.bannerImageSmall}`} src={youTubeAdSmall} />
      </a>
    </div>
  );
};

export default YouTubeAd;
