import React from 'react';
import { NavLink } from '../NavLink/NavLink';
import DndLogo from '../HeroBanner/DMLogo';
import { User } from '@auth0/auth0-react';
const footerBg = require('./FooterBackground.jpg');

const styles = require('./footer.module.scss');

const Footer = (props: { user?: User }) => {
  return (
    <div className={styles.wrapper}>
      <img src={footerBg} className={styles.backgroundImage} />
      <div className={styles.content}>
        <div className={styles.left}>
          <h3 className={styles.siteTitle}>The Dungeon Master Screen</h3>
          <DndLogo className={styles.logo} />
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
