import { Link } from '@reach/router';
import React from 'react';

const styles = require('./navlink.module.scss');

export const NavLink = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkActive : styles.navLink,
    })}
  />
);

export const NavLinkSmall = (props) => (
  <Link
    {...props}
    getProps={({ isCurrent }) => ({
      className: isCurrent ? styles.navLinkSmallActive : styles.navLinkSmall,
    })}
  />
);
