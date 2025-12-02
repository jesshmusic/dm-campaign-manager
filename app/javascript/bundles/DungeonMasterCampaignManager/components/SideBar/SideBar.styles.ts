/**
 * Styled components for SideBar
 * Migrated from sidebar.module.scss and sidebar-vars.scss
 */

import styled from 'styled-components';
import { MenuItemStyles } from 'react-pro-sidebar';

/**
 * Wrapper for the Sidebar component to apply custom styles
 */
export const SidebarWrapper = styled.div`
  /* Override react-pro-sidebar default styles */
  .ps-sidebar-root {
    border-right: 0.25rem solid ${({ theme }) => theme.sidebar.borderColor};
    height: 100vh;
    position: fixed;
    top: 0;
    z-index: ${({ theme }) => theme.zIndex.fixed};
  }

  .ps-sidebar-container {
    /* Make container a flex column to push footer to bottom */
    display: flex;
    flex-direction: column;
    height: 100%;

    /* Make container scrollable without visible scrollbar */
    -ms-overflow-style: none;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  /* Main menu should not grow, let footer take remaining space */
  .ps-menu-root {
    flex-shrink: 0;
  }

  /* Background image styling */
  .ps-sidebar-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-size: cover;
    background-position: left;
    opacity: 1;
    z-index: -1;
  }
`;

/**
 * Styled footer section (replaces SidebarFooter)
 */
export const StyledFooter = styled.div`
  margin-bottom: 0;
  margin-top: auto;
`;

/**
 * User welcome section with name and role
 */
export const UserWelcome = styled.div`
  font-size: 1.15rem;
  border-bottom: 2px solid ${({ theme }) => theme.sidebar.borderColor};
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  margin-bottom: 0.33rem;
  padding: 1rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

/**
 * Role badge label
 */
export const RoleLabel = styled.span`
  background-color: rgba(127, 81, 62, 0.75);
  border-radius: 1rem;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.66rem;
  font-weight: bold;
  line-height: 1;
  padding: 0.35rem 0.5rem;
  text-transform: uppercase;
`;

/**
 * Styled button for menu items (logout, login)
 */
export const MenuButton = styled.button`
  background: none;
  border: 0;
  color: ${({ theme }) => theme.sidebar.textColor};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: inherit;
  padding: 0;
  text-decoration: none;
  transition: color ease-in-out 0.25s;
  width: 100%;
  text-align: left;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

/**
 * Styled anchor for external links (Patreon)
 */
export const MenuLink = styled.a`
  background: none;
  border: 0;
  color: ${({ theme }) => theme.sidebar.textColor};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: inherit;
  padding: 0;
  text-decoration: none;
  transition: color ease-in-out 0.25s;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
  }
`;

/**
 * Menu item styles for react-pro-sidebar v1.x
 * Applied via menuItemStyles prop on Menu component
 */
export const menuItemStyles: MenuItemStyles = {
  root: {
    fontSize: '1rem',
    fontFamily: "'Mr Eaves', serif",
  },
  button: ({ level, active }) => ({
    color: active ? '#ffffff' : '#efb3ab',
    backgroundColor: 'transparent',
    fontFamily: "'Mr Eaves', serif",
    paddingLeft: level === 0 ? '20px' : `${20 + level * 20}px`,
    '&:hover': {
      color: '#ffffff',
      backgroundColor: 'transparent',
    },
  }),
  icon: {
    fontSize: '1.25rem',
    marginRight: '0.5rem',
  },
  label: {
    fontWeight: 'normal',
  },
  subMenuContent: {
    backgroundColor: 'rgba(71, 21, 13, 0.3)',
    borderTop: '0.125rem solid #c9ad6a',
    borderBottom: '0.125rem solid #c9ad6a',
  },
  SubMenuExpandIcon: {
    color: '#d47a6d',
  },
};

/**
 * Root styles for the Sidebar component
 */
export const sidebarRootStyles = {
  borderRight: '0.25rem solid #c9ad6a',
  height: '100vh',
  position: 'fixed' as const,
  top: 0,
};
