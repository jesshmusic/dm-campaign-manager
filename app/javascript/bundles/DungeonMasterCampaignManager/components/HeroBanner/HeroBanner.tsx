import React from 'react';
import DndLogo from './DMLogo';

import styles from './hero-banner.module.scss';

const HeroBanner = () => {
  return (
    <div className={styles.heroBanner}>
      <DndLogo className={styles.logo} />
      <div className={styles.title}>Dungeon Master GURU</div>
    </div>
  );
};

export default HeroBanner;
