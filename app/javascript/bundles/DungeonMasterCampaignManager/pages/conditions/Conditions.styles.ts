/**
 * Styled components for Conditions
 * Migrated from conditions.module.scss
 */

import styled from 'styled-components';
import { respContainerStyles } from '../../theme/mixins';

export const ConditionWrapper = styled.div`
  ${respContainerStyles}
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: 0 1rem;
  width: 100%;
`;

export const Description = styled.ul`
  font-style: italic;
  margin-bottom: 1rem;
  margin-top: -${({ theme }) => theme.spacing.spacer};
`;
