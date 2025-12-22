/**
 * Styled components for Rules Index
 */

import styled from 'styled-components';
import { respondTo } from '../../theme/mixins';

export const RulesGrid = styled.div`
  display: grid;
  gap: calc(${({ theme }) => theme.spacing.spacer} * 1.5);
  grid-template-columns: minmax(0, 1fr);
  max-width: 100%;
  overflow: hidden;
  padding: ${({ theme }) => theme.spacing.spacer};

  ${respondTo.sm`
    grid-template-columns: repeat(2, minmax(0, 1fr));
  `}

  ${respondTo.xl`
    grid-template-columns: repeat(3, minmax(0, 1fr));
  `}

  a {
    text-decoration: none;
  }
`;

export const RuleCard = styled.div`
  align-items: center;
  background: ${({ theme }) => theme.colors.cardBg};
  border-image: url('/images/dndFrameOrange.png') 10;
  border-style: solid;
  border-width: 5px 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacer};
  padding: ${({ theme }) => theme.spacing.spacer};
  transition: all 0.2s ease;

  &:hover {
    box-shadow: ${({ theme }) => theme.shadows.lg};
    transform: translateY(-2px);
  }
`;

export const RuleCardIcon = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.textRed};
  display: flex;
  flex-shrink: 0;
  font-size: 2.5rem;
  justify-content: center;
  width: 50px;
`;

export const RuleCardContent = styled.div`
  flex: 1;
  min-width: 0;

  h3 {
    color: ${({ theme }) => theme.colors.textRed};
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    margin: 0 0 0.25rem;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

export const RuleCardCount = styled.span`
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;
