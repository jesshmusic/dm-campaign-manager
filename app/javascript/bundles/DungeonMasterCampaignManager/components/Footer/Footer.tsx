import React from 'react';
import { NavLink } from '../NavLink/NavLink';
import DndLogo from '../HeroBanner/DMLogo';
import { User } from '@auth0/auth0-react';

import footerBg from './FooterBackground.jpg';
import patreonBanner from './PatreonBanner.png';

import styles from './footer.module.scss';

const PATREON_URL =
  'https://patreon.com/DormanLakely?utm_medium=unknown&utm_source=join_link&utm_campaign=creatorshare_creator&utm_content=copyLink';

const Footer = (_props: { user?: User }) => {
  return (
    <div className={styles.wrapper}>
      <img src={footerBg} className={styles.backgroundImage} alt="" />
      <div className={styles.content}>
        <div className={styles.left}>
          <h3 className={styles.siteTitle}>Dungeon Master GURU</h3>
          <DndLogo className={styles.logo} />
        </div>
        <div className={styles.center}>
          <a
            href={PATREON_URL}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.patreonBanner}
          >
            <img src={patreonBanner} alt="Become a Patron" className={styles.patreonImage} />
            <span className={styles.patreonText}>Become a Patron</span>
          </a>
        </div>
        <div className={styles.right}>
          <ul className={styles.nav}>
            <NavLink to={'/'} className={styles.footerLink}>
              Home
            </NavLink>
            <NavLink to={'/app/classes'} className={styles.footerLink}>
              Classes
            </NavLink>
            <NavLink to={'/app/races'} className={styles.footerLink}>
              Races
            </NavLink>
            <NavLink to={'/app/monsters'} className={styles.footerLink}>
              Monsters
            </NavLink>
            <NavLink to={'/app/items'} className={styles.footerLink}>
              Items and Equipment
            </NavLink>
            <NavLink to={'/app/spells'} className={styles.footerLink}>
              Spells
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Footer;
