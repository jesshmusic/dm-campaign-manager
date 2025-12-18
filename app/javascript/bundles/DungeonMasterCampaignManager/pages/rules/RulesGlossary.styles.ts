/**
 * Styled components for RulesGlossary
 */

import styled from 'styled-components';

// Re-export shared styles from Rule.styles
export { RuleContent, TableFrame } from './Rule.styles';

export const GlossarySourceInfo = styled.div`
  background-color: ${({ theme }) => theme.colors.lightBg};
  border-left: 4px solid ${({ theme }) => theme.colors.gold};
  margin-bottom: 1.5rem;
  padding: 0.75rem 1rem;

  p {
    margin: 0.25rem 0;
    font-size: 0.9rem;
    color: ${({ theme }) => theme.colors.textMuted};
  }
`;

export const GlossaryTOC = styled.nav`
  background-color: ${({ theme }) => theme.colors.lightBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borders.radius};
  margin: 2rem 0;
  padding: 1.5rem;

  h3 {
    color: ${({ theme }) => theme.colors.primaryDark};
    font-family: ${({ theme }) => theme.fonts.serif};
    font-size: 1.25rem;
    margin: 0 0 1rem;
    padding-bottom: 0.5rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gold};
  }

  > div {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }
`;

export const GlossaryTOCItem = styled.button`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: ${({ theme }) => theme.borders.radius};
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.9rem;
  padding: 0.5rem 0.75rem;
  transition: all 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.white};
  }
`;

export const GlossarySection = styled.section`
  margin: 2rem 0;
  padding-top: 1rem;
`;

export const GlossarySectionTitle = styled.h2`
  color: ${({ theme }) => theme.colors.primaryDark};
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 1.75rem;
  border-bottom: 2px solid ${({ theme }) => theme.colors.gold};
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
`;

export const GlossaryTermList = styled.dl`
  margin: 0;
  padding: 0;
`;

export const GlossaryTermItem = styled.div`
  margin-bottom: 0.75rem;
  padding: 0.5rem 0;

  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;
    font-size: 1.1rem;

    &:hover {
      text-decoration: underline;
    }
  }

  strong {
    display: block;
    margin-bottom: 0.5rem;
  }

  span,
  p {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.95rem;
    line-height: 1.5;
    display: block;
  }

  ul,
  ol {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
    font-size: 0.95rem;
  }

  li {
    margin-bottom: 0.25rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  table {
    margin-top: 0.5rem;
    font-size: 0.9rem;
    width: 100%;

    th,
    td {
      padding: 0.25rem 0.5rem;
    }
  }
`;
