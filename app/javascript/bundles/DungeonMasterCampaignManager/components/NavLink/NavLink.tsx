import { Link } from '@reach/router';
import React from 'react';
import { GiDragonHead } from 'react-icons/all';

const styles = require('./navlink.module.scss');

export const NavLink = (props) => {
  const { showActiveIcon, children, icon, ...inputProps } = props;
  return (
    <Link
      {...inputProps}
      getProps={({ isCurrent }) => ({
        className: isCurrent ? styles.navLinkActive : styles.navLink
      })}
    >
      <span>
        <span className={styles.icon}>{icon}</span><span className={styles.title}>{children}</span>
      </span>
      <span className={styles.activeIcon}>
        {showActiveIcon && <GiDragonHead className={styles.dragonHead} />}
      </span>
    </Link>
  );
};

export const NavLinkSmall = (props) => {
  const { showActiveIcon, children, icon, ...inputProps } = props;
  return (
    <Link
      {...inputProps}
      getProps={({ isCurrent }) => ({
        className: isCurrent ? styles.navLinkSmallActive : styles.navLinkSmall
      })}
    >
      <span>
        <span className={styles.icon}>{icon}</span><span className={styles.title}>{children}</span>
      </span>
      <span className={styles.activeIcon}>
        {showActiveIcon && <GiDragonHead className={styles.dragonHead} />}
      </span>
    </Link>
  );
};
