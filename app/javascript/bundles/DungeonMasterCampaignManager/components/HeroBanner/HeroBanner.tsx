import React from 'react';
import DndLogo from './DMLogo';

const styles = require('./hero-banner.module.scss');

const HeroBanner = () => {
  return (
    <div className={styles.heroBanner}>
      <DndLogo className={styles.logo} />
      <div className={styles.title}>The Dungeon Master Screen</div>
    </div>
  );
};

export default HeroBanner;
