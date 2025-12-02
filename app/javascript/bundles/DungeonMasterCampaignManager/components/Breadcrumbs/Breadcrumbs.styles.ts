/**
 * Styled components for Breadcrumbs
 * Migrated from breadcrumbs.module.scss
 */

import styled from 'styled-components';
import { respondToContainer } from '../../theme/mixins';

export const BackButton = styled.button`
  background-color: transparent;
  border: 0;
  color: ${({ theme }) => theme.colors.darkRed};
  outline: none;
  padding-right: 1rem;
  transition: color 0.25s ease-in-out;

  svg {
    transform: scaleX(-1) rotate(-45deg);
  }

  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const HomeIcon = styled.li`
  color: ${({ theme }) => theme.colors.darkRed};
  padding-right: 1rem;
`;

export const BreadcrumbList = styled.ol<{ $isCollapsed?: boolean }>`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.backgroundMed};
  border-collapse: separate;
  border-image: url('/images/dndFrameOrange.png') 10;
  border-style: solid;
  border-width: 5px;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-wrap: wrap;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  list-style: none;
  margin: 0 0 0 5rem;
  padding: 0.35rem 1rem;

  ${respondToContainer.md`
    margin: 0 0 0 15rem;
    padding: 0.35rem 0;
  `}

  ${({ $isCollapsed }) =>
    $isCollapsed &&
    `
    margin: 0 0 0 5rem;
    padding: 1rem;
  `}
`;

export const BreadcrumbItem = styled.li<{ $isActive?: boolean }>`
  & + & {
    padding-left: 0.5rem;
  }

  ${({ $isActive, theme }) =>
    $isActive &&
    `
    color: ${theme.colors.gray600};
  `}

  svg {
    transform: rotate(45deg);
  }
`;
