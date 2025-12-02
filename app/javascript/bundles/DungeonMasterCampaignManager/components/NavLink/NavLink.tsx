import { Link, useMatch, useResolvedPath } from 'react-router-dom';
import React from 'react';
import { GiDragonHead } from 'react-icons/gi';
import { MenuItem } from 'react-pro-sidebar';

import {
  NavLinkStyled,
  NavLinkSmallStyled,
  NavLinkButton,
  Icon,
  DragonHead,
} from './NavLink.styles';

export const SidebarButton = (props: {
  title: string;
  icon?: React.ReactNode;
  onClick: () => void;
}) => {
  const { title, icon, onClick } = props;
  return (
    <MenuItem icon={icon} onClick={onClick}>
      {title}
    </MenuItem>
  );
};

export const SidebarLink = (props: { title: string; icon?: React.ReactNode; to: string }) => {
  const { title, icon, to } = props;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <MenuItem icon={icon} active={!!match} component={<Link to={to} />}>
      {title}
    </MenuItem>
  );
};

export const NavLink = (props) => {
  const { showActiveIcon, children, icon, isButton, to, ...inputProps } = props;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  if (isButton) {
    return (
      <NavLinkButton to={to} {...inputProps}>
        <span>
          <Icon>{icon}</Icon>
          <span>{children}</span>
        </span>
      </NavLinkButton>
    );
  }
  return (
    <NavLinkStyled to={to} $isActive={!!match} {...inputProps}>
      <span>
        <Icon>{icon}</Icon>
        <span>{children}</span>
      </span>
      <span>
        {showActiveIcon && (
          <DragonHead $isActive={!!match}>
            <GiDragonHead />
          </DragonHead>
        )}
      </span>
    </NavLinkStyled>
  );
};

export const NavLinkSmall = (props) => {
  const { showActiveIcon, children, icon, to, ...inputProps } = props;
  const resolved = useResolvedPath(to);
  const match = useMatch({ path: resolved.pathname, end: true });
  return (
    <NavLinkSmallStyled to={to} $isActive={!!match} {...inputProps}>
      <span>
        <Icon>{icon}</Icon>
        <span>{children}</span>
      </span>
      <span>
        {showActiveIcon && (
          <DragonHead $isActive={!!match}>
            <GiDragonHead />
          </DragonHead>
        )}
      </span>
    </NavLinkSmallStyled>
  );
};
