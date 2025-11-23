import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import React from 'react';
import { GiDragonHead } from 'react-icons/all';
import { MenuItem } from 'react-pro-sidebar';

import styles from './navlink.module.scss';
import buttonStyles from '../Button/button.module.scss';

export const SidebarButton = (props: {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) => {
  const { title, icon, onClick } = props;
  return (
    <MenuItem icon={icon} active={false} onClick={onClick}>
      {title}
    </MenuItem>
  );
};

export const SidebarLink = (props: { title: string; icon?: React.ReactNode; to: string }) => {
  const { title, icon, to } = props;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <MenuItem icon={icon} active={!!match}>
      {title}
      <Link to={to} />
    </MenuItem>
  );
};

export const NavLink = (props) => {
  const { showActiveIcon, children, icon, isButton, ...inputProps } = props;
  const resolved = useResolvedPath(props.to);
  const match = useMatch({ path: resolved.pathname, end: true });
  if (isButton) {
    return (
      <Link {...inputProps} className={`${buttonStyles.button} ${buttonStyles.info}`}>
        <span>
          <span className={styles.icon}>{icon}</span>
          <span className={styles.title}>{children}</span>
        </span>
      </Link>
    );
  }
  return (
    <Link {...inputProps} className={match ? styles.navLinkActive : styles.navLink}>
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
