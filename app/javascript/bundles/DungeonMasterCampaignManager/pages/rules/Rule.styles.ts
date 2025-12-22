/**
 * Styled components for Rule
 * Migrated from rule.module.scss
 */

import styled from 'styled-components';

export const RuleContent = styled.div`
  margin: 0 auto;
  max-width: 900px;
  padding: calc(${({ theme }) => theme.spacing.spacer} * 2) 0
    calc(${({ theme }) => theme.spacing.spacer} * 4);
  width: 100%;

  /* Markdown headings */
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    color: ${({ theme }) => theme.colors.primaryDark};
    font-family: ${({ theme }) => theme.fonts.serif};
    margin-top: 1.5rem;
    margin-bottom: 0.75rem;
  }

  h1 {
    font-size: 2rem;
    border-bottom: 2px solid ${({ theme }) => theme.colors.gold};
    padding-bottom: 0.5rem;
  }

  h2 {
    font-size: 1.75rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gold};
    padding-bottom: 0.3rem;
  }

  h3 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.primary};
  }

  h4 {
    font-size: 1.25rem;
  }

  /* Bold and emphasis */
  strong,
  b {
    font-weight: bold;
    color: ${({ theme }) => theme.colors.primaryDark};
  }

  em,
  i {
    font-style: italic;
  }

  /* Paragraphs */
  p {
    margin-bottom: 1rem;
    line-height: 1.6;
  }

  /* Lists */
  ul,
  ol {
    margin-bottom: 1rem;
    padding-left: 2rem;
  }

  li {
    margin-bottom: 0.5rem;
    line-height: 1.5;
  }

  /* Blockquotes */
  blockquote {
    border: 2px solid ${({ theme }) => theme.colors.gold};
    border-radius: ${({ theme }) => theme.borders.radius};
    margin: 1rem 0;
    padding: 1rem;
    background-color: ${({ theme }) => theme.colors.lightBg};

    h3 {
      font-family: ${({ theme }) => theme.fonts.mrEaves};
      margin: 0 0 0.5rem;
    }

    p {
      margin: 0 0 0.5rem;
    }
  }

  /* Code */
  code {
    background-color: ${({ theme }) => theme.colors.lightBg};
    padding: 0.2rem 0.4rem;
    border-radius: 3px;
    font-family: monospace;
  }

  /* Links */
  a {
    color: ${({ theme }) => theme.colors.primary};
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  /* Horizontal rules */
  hr {
    border: none;
    border-top: 2px solid ${({ theme }) => theme.colors.gold};
    margin: 2rem 0;
  }

  table {
    border-collapse: collapse;
    margin-bottom: 1rem;
    table-layout: fixed;
    width: 100%;

    thead {
      background-color: ${({ theme }) => theme.table.headBg};
      color: ${({ theme }) => theme.table.headColor};

      tr th {
        font-weight: bold;
        padding: ${({ theme }) => theme.table.cellPadding};
      }
    }

    tbody tr {
      &:nth-child(odd) {
        background-color: ${({ theme }) => theme.table.accentBg};
      }

      td {
        font-family: ${({ theme }) => theme.fonts.sansSerif};
        padding: ${({ theme }) => theme.table.cellPadding};
        word-wrap: break-word;
      }
    }
  }
`;

export const TableFrame = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-collapse: separate;
  border-image: url('/images/dndFrame.png') 150 200 150 200 / 47px / 25px 17px;
  border-style: solid;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: block;
  margin-bottom: 40px;
  margin-top: 25px;
  width: 100%;
`;

// Navigation components for prev/next buttons
export const RuleNavigation = styled.nav`
  border-top: 2px solid ${({ theme }) => theme.colors.gold};
  display: flex;
  gap: 1rem;
  justify-content: space-between;
  margin-top: 2rem;
  padding-top: 1rem;
`;

export const NavButton = styled.a`
  align-items: center;
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.gray700};
  cursor: pointer;
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: ${({ theme }) => theme.colors.gray100};
    border-color: ${({ theme }) => theme.colors.gold};
    color: ${({ theme }) => theme.colors.textRed};
  }

  svg {
    font-size: 1.25rem;
  }
`;

export const NavButtonText = styled.div`
  display: flex;
  flex-direction: column;

  small {
    color: ${({ theme }) => theme.colors.gray500};
    font-size: 0.75rem;
  }

  span {
    font-family: ${({ theme }) => theme.fonts.mrEaves};
    font-size: 1rem;
  }
`;

export const NavSpacer = styled.div`
  flex: 1;
`;
