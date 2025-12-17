/**
 * Styled components for Rules Index
 */

import styled from 'styled-components';
import { respondTo } from '../../theme/mixins';

export const RulesGrid = styled.div`
  display: grid;
  gap: calc(${({ theme }) => theme.spacing.spacer} * 1.5);
  grid-template-columns: 1fr;
  max-width: 100%;
  overflow: hidden;
  padding-top: calc(${({ theme }) => theme.spacing.spacer} * 2);

  ${respondTo.sm`
    grid-template-columns: repeat(2, 1fr);
  `}

  ${respondTo.lg`
    grid-template-columns: repeat(3, 1fr);
  `}

  a {
    text-decoration: none;
  }
`;

export const CategoryCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-image: url('/images/dndFrameOrange.png') 10;
  border-style: solid;
  border-width: 5px 0;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: flex;
  flex-direction: column;
  padding: ${({ theme }) => theme.spacing.spacer};
`;

export const CategoryHeader = styled.div`
  align-items: center;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gold};
  display: flex;
  gap: ${({ theme }) => theme.spacing.spacer};
  margin-bottom: ${({ theme }) => theme.spacing.spacer};
  padding-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.75);
`;

export const CategoryIcon = styled.div`
  align-items: center;
  color: ${({ theme }) => theme.colors.textRed};
  display: flex;
  flex-shrink: 0;
  font-size: 2.5rem;
  justify-content: center;
  width: 50px;
`;

export const CategoryTitle = styled.h3`
  color: ${({ theme }) => theme.colors.textRed};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes['2xl']};
  margin: 0;
`;

export const CategoryRulesList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;

  li {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray200};
    padding: calc(${({ theme }) => theme.spacing.spacer} * 0.5) 0;

    &:last-child {
      border-bottom: none;
    }
  }
`;

export const CategoryRuleLink = styled.a`
  color: ${({ theme }) => theme.colors.gray700};
  display: block;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.md};
  padding: calc(${({ theme }) => theme.spacing.spacer} * 0.25)
    calc(${({ theme }) => theme.spacing.spacer} * 0.5);
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    color: ${({ theme }) => theme.colors.textRed};
  }
`;

// Legacy exports for backward compatibility
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
