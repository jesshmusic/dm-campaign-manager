import { Link, Match } from '@reach/router';
import React from 'react';
import { GiDragonHead } from 'react-icons/all';
import { MenuItem } from 'react-pro-sidebar';

const styles = require('./navlink.module.scss');

export const SidebarLink = (props: {
  title: string;
  icon?: React.ReactNode;
  to: string;
}) => {
  const { title, icon, to } = props;
  return (
    <Match path={to}>
      {({ match }) => (
        <MenuItem icon={icon} active={!!match}>
          {title}
          <Link to={to} />
        </MenuItem>
      )}
    </Match>
  );
};

export const NavLink = (props) => {
  const { showActiveIcon, children, icon, ...inputProps } = props;
  return (
    <Link
      {...inputProps}
      getProps={({ isCurrent }) => ({
        className: isCurrent ? styles.navLinkActive : styles.navLink,
      })}
    >
      <span>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{children}</span>
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
        className: isCurrent ? styles.navLinkSmallActive : styles.navLinkSmall,
      })}
    >
      <span>
        <span className={styles.icon}>{icon}</span>
        <span className={styles.title}>{children}</span>
      </span>
      <span className={styles.activeIcon}>
        {showActiveIcon && <GiDragonHead className={styles.dragonHead} />}
      </span>
    </Link>
  );
};
