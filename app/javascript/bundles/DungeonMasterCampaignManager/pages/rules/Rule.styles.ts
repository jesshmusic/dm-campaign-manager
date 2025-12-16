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

export const RulesList = styled.div`
  padding-top: ${({ theme }) => theme.spacing.spacer};
`;

export const TableFrame = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-collapse: separate;
  border-image: url('/images/dndFrame.png') 150 200 150 200 / 47px / 25px 17px;
  border-style: solid;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: inline-block;
  margin-bottom: 40px;
  margin-top: 25px;
  width: 100%;
`;
