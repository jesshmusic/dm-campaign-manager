import React from 'react';

const styles = require('./bannerad.module.scss');

const BannerAd = () => (
  <div className={styles.bannerAdContainer}>
    <a
      href="https://affiliates.fantasygrounds.com/324247/15958/banner_7297"
      target="_blank"
      style={{ textDecoration: 'none' }}
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

export default BannerAd;
