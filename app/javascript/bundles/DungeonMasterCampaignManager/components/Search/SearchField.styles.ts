/**
 * Styled components for SearchField
 * Migrated from search-field.module.scss
 */

import styled from 'styled-components';
import { formInputStyles } from '../../theme/mixins';

export const SearchBar = styled.form<{ $sidebarWidth?: number }>`
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
  margin-left: ${({ $sidebarWidth }) => $sidebarWidth || 80}px;
  padding: 0.35rem 1rem;
  transition: margin-left 0.15s ease-out;
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

  /* Style the search button to connect with input */
  button {
    border: 0;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin: 0 0 0 -0.0625rem;
  }
`;
