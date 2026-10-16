import styled from 'styled-components';

export const ConnectionsGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 22rem), 1fr));
`;

export const ConnectionCard = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.bodyColor};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  padding: 1rem;

  h3 {
    margin: 0 0 0.5rem;
  }

  p {
    margin: 0 0 0.75rem;
  }
`;

export const Muted = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Notice = styled.p<{ $tone: 'success' | 'danger' }>`
  border-left: 4px solid ${({ theme, $tone }) => theme.colors[$tone]};
  padding-left: 0.5rem;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const TokenForm = styled.form`
  align-items: flex-end;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;

  label {
    display: flex;
    flex: 1 1 12rem;
    flex-direction: column;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    gap: 0.25rem;
  }

  input {
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 4px;
    padding: 0.4rem 0.5rem;
  }
`;

export const TokenList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
`;

export const TokenRow = styled.li`
  align-items: center;
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  padding: 0.5rem 0;

  code {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }
`;
