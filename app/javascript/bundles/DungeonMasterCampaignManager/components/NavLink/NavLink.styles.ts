/**
 * Styled components for NavLink
 * Migrated from navlink.module.scss
 */

import styled, { css } from 'styled-components';
import { Link } from 'react-router-dom';
import { adjustLightness } from '../../theme/mixins';

const navLinkBase = css`
  align-items: center;
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 1.15rem;
  justify-content: space-between;
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.75);
  width: 100%;
`;

const navLinkSmallBase = css`
  ${navLinkBase}
  font-size: 1rem;
  margin-bottom: 0.25rem;
  padding-left: 1rem;
`;

export const NavLinkStyled = styled(Link)<{ $isActive?: boolean }>`
  ${navLinkBase}
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : adjustLightness(theme.colors.primary, 30)};
  cursor: pointer;
  transition: color ease-in-out 0.25s;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

export const NavLinkSmallStyled = styled(Link)<{ $isActive?: boolean }>`
  ${navLinkSmallBase}
  color: ${({ $isActive, theme }) =>
    $isActive ? theme.colors.white : adjustLightness(theme.colors.primary, 30)};
  cursor: pointer;
  transition: color ease-in-out 0.25s;

  &:hover {
    color: ${({ theme }) => theme.colors.white};
    text-decoration: none;
  }
`;

export const DragonHead = styled.span<{ $isActive?: boolean }>`
  display: ${({ $isActive }) => ($isActive ? 'block' : 'none')};
  height: 1.25rem;
  transform: rotateY(-180deg);
  width: 1.25rem;
`;

export const Icon = styled.span`
  margin-right: 0.5rem;
`;

export const NavLinkButton = styled(Link)`
  align-items: center;
  align-self: center;
  background-color: ${({ theme }) => theme.colors.info};
  border: 0;
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors.gray900};
  display: inline-flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 1rem;
  font-weight: normal;
  line-height: 1.25;
  margin: 0.5rem 0.5rem 0.5rem 0;
  padding: 0.5rem 0.75rem;
  text-align: center;
  transition: all 0.25s ease-in-out;
  user-select: none;
  vertical-align: middle;

  &:hover {
    background-color: ${({ theme }) => adjustLightness(theme.colors.info, -20)};
    text-decoration: none;
  }
`;
