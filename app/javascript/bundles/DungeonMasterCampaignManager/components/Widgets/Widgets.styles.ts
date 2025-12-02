/**
 * Styled components for Widgets
 * Migrated from widgets.module.scss
 */

import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { formInputStyles, buttonBarStyles, respondTo } from '../../theme/mixins';

export const Input = styled.input`
  ${formInputStyles}
  border-bottom-right-radius: 0;
  border-top-right-radius: 0;
  flex: 1;
  position: relative;
`;

export const NameOptions = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.spacer};
  grid-template-columns: 1fr;
  width: 100%;

  ${respondTo.md`
    grid-template-columns: 1fr 1fr 1fr;
  `}

  button {
    margin: 0;
    width: 100%;
  }
`;

export const ButtonBar = styled(Link)`
  ${buttonBarStyles}
`;

export const Content = styled.div`
  padding-top: ${({ theme }) => theme.spacing.spacer};
`;

export const TwoColumn = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.spacer};
  grid-template-columns: 1fr 1fr;
  padding-top: calc(${({ theme }) => theme.spacing.spacer} * 2);
  width: 100%;
`;

export const TableFrame = styled.div`
  table {
    table-layout: fixed;
    width: 100%;
    border-collapse: collapse;

    thead {
      tr {
        th {
          font-family: ${({ theme }) => theme.fonts.mrEaves};
          text-align: left;
          padding: 0.5rem;
          border-bottom: 2px solid ${({ theme }) => theme.colors.gray300};
        }
      }
    }

    tbody {
      tr {
        &:nth-child(odd) {
          background-color: ${({ theme }) => theme.colors.gray100};
        }

        td {
          font-family: ${({ theme }) => theme.fonts.sansSerif};
          word-wrap: break-word;
          padding: 0.5rem;
        }
      }
    }
  }
`;

export const WidgetWrapper = styled.div`
  width: 100%;
  height: 100%;
`;

export const Label = styled.label`
  display: block;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
`;
