import { Link } from '@reach/router';
import React from 'react';
import { GiDragonHead } from 'react-icons/all';

const styles = require('./navlink.module.scss');

export const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkActive : styles.navLink,
    })}
  >
    <span>
      {props.icon}&nbsp;{props.children}
    </span>
    {props.showActiveIcon && <GiDragonHead className={styles.dragonHead} />}
  </Link>
);

export const NavLinkSmall = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkSmallActive : styles.navLinkSmall,
    })}
  >
    <span>
      {props.icon}&nbsp;{props.children}
    </span>
    {props.showActiveIcon && <GiDragonHead className={styles.dragonHead} />}
  </Link>
);
