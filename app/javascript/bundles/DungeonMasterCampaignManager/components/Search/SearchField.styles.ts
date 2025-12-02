/**
 * Styled components for SearchField
 * Migrated from search-field.module.scss
 */

import styled from 'styled-components';
import { formInputStyles, respondToContainer } from '../../theme/mixins';

export const SearchBar = styled.form<{ $isCollapsed?: boolean }>`
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

export const InputGroup = styled.div`
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 100%;

  input {
    ${formInputStyles}
    border-radius: ${({ theme }) => theme.borders.radiusLg} 0 0 ${({ theme }) =>
      theme.borders.radiusSm};
    flex: 1 1 auto;
    min-width: 0;
    padding: 0.5rem;
    position: relative;
    width: 1%;
  }
`;

export const SearchButton = styled.span`
  border: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  margin: 0 0 0 -0.0625rem;
`;
