import styled from 'styled-components';

export const Section = styled.div`
  column-gap: 5rem;
  columns: 400px 2;
  min-height: 30rem;

  table {
    background-color: transparent;
    border-collapse: collapse;
    color: ${({ theme }) => theme.colors.bodyColor};
    margin-bottom: 1rem;
    vertical-align: top;
    width: 100%;

    > :not(caption) > * > * {
      padding: 0.5rem 0.5rem;
    }

    > tbody > tr:nth-of-type(odd) > * {
      background-color: rgba(0, 0, 0, 0.05);
    }

    tbody tr td {
      font-family: ${({ theme }) => theme.fonts.sansSerif};
    }
  }
`;

export const Info = styled.div`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  margin-bottom: 1.5rem;
  width: 100%;

  h2 {
    border: 0;
    color: ${({ theme }) => theme.colors.bodyColor};
    font-family: ${({ theme }) => theme.fonts.sansSerif};
    font-size: 0.9rem;
    font-style: italic;
    margin-top: -1rem;
  }

  span {
    font-style: italic;
    font-weight: bold;
    margin-right: 0.5rem;
    text-transform: capitalize;
  }

  p {
    margin: 0;
  }

  ul {
    list-style: none;
    padding-left: 0;
  }

  li {
    padding: 0.25rem 0;
  }
`;

export const TableFrame = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border-collapse: separate;
  border-image: ${({ theme }) => theme.borders.orangeBorder};
  border-style: solid;
  box-shadow: ${({ theme }) => theme.shadows.md};
  display: inline-block;
  margin-bottom: 40px;
  margin-top: 25px;
  width: 100%;
`;
