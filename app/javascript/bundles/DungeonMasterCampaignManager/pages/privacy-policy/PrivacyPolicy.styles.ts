/**
 * Styled components for PrivacyPolicy
 * Migrated from privacy-policy.module.scss
 */

import styled from 'styled-components';
import { respContainerStyles, buttonBarStyles } from '../../theme/mixins';

export const Wrapper = styled.div`
  ${respContainerStyles}
`;

export const Section = styled.section`
  padding: ${({ theme }) => theme.spacing.spacer} 0;
  width: 100%;
`;

export const ButtonBar = styled.a`
  ${buttonBarStyles}
`;
