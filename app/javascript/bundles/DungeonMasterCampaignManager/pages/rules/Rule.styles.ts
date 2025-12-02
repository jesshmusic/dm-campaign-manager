/**
 * Styled components for Rule
 * Migrated from rule.module.scss
 */

import styled from 'styled-components';

export const RuleContent = styled.div`
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 1rem;

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
  display: inline-block;
  margin-bottom: 40px;
  margin-top: 25px;
  width: 100%;
`;

