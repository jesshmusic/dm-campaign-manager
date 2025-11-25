import React from 'react';
import ReactGA from 'react-ga4';

ReactGA.initialize('G-8XJTH70JSQ');

import styles from './bannerad.module.scss';

const BannerAd = () => {
  const handleClick = () => {
    ReactGA.event('Banner Ad Clicked');
  };
  return (
    <div className={styles.bannerAdContainer}>
      <a
        href="https://affiliates.fantasygrounds.com/324247/15958/banner_7297"
        target="_blank"
        style={{ textDecoration: 'none' }}
        onClick={handleClick}
        rel="noreferrer"
      >
        <img
          src="https://affiliates.fantasygrounds.com/banner_image/banner/id:7297_324247_15958"
          height="0"
          width="0"
        />
        <img
          className={`${styles.bannerImage} ${styles.bannerImageLarge}`}
          src="https://affiliates.fantasygrounds.com/img/banners/316034_2156040637.jpg"
        />
        <img
          className={`${styles.bannerImage} ${styles.bannerImageSmall}`}
          src="https://affiliates.fantasygrounds.com/img/banners/316034_2966475059.jpg"
        />
      </a>
    </div>
  );
};

export default BannerAd;
