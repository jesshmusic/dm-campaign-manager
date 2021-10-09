import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from '../../SideBar/SideBar';

const styles = require('./footer.module.scss');

const Footer = () => {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <h3 className='mr-eaves'>The Dungeon Master Screen</h3>
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
  );
};

Footer.propTypes = {
  user: PropTypes.object
};

export default Footer;
