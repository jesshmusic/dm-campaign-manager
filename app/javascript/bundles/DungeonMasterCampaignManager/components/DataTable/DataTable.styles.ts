import styled from 'styled-components';
import { respondTo, formInputStyles } from '../../theme/mixins';
import Button from '../Button/Button';

export const TableWrapper = styled.div`
  form {
    margin: 1rem 0;
  }
`;

export const Pagination = styled.nav`
  ${respondTo.md} {
    align-items: baseline;
    display: flex;
    justify-content: space-between;
  }
`;

export const PageNumber = styled.div`
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};

  span {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const PageForm = styled.div`
  align-items: center;
  display: flex;
`;

export const InputGroup = styled.div`
  align-items: stretch;
  display: flex;
  flex-wrap: wrap;
  position: relative;
  width: 100%;

  input {
    ${formInputStyles}
    border-radius: ${({ theme }) => theme.borderRadius.lg} 0 0 ${({ theme }) =>
      theme.borderRadius.sm};
    flex: 1 1 auto;
    min-width: 0;
    padding: 0.5rem;
    position: relative;
    width: 1%;
  }
`;

export const SearchButton = styled(Button)`
  border: 0;
  border-bottom-left-radius: 0;
  border-top-left-radius: 0;
  margin: 0 0 0 -0.0625rem;
`;
