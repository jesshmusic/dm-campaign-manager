/**
 * Styled components for Breadcrumbs
 * Migrated from breadcrumbs.module.scss
 */

import styled from 'styled-components';

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

export const BreadcrumbList = styled.ol<{ $sidebarWidth?: number }>`
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
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth ?? 80}px;
  padding: 0.35rem 1rem;
  transition: margin-left 0.15s ease-out;
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
