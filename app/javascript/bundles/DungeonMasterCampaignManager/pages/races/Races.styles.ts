/**
 * Styled components for Races
 * Migrated from races.module.scss
 */

import styled from 'styled-components';
import { respContainerStyles } from '../../theme/mixins';

export const RacePageWrapper = styled.div`
  ${respContainerStyles}
`;

export const Subheading = styled.h3`
  border-bottom: 0.05rem solid ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.darkRed};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.lg};
`;

export const TraitName = styled.span`
  font-family: ${({ theme }) => theme.fonts.serif};
  font-style: italic;
  font-weight: bold;
`;
