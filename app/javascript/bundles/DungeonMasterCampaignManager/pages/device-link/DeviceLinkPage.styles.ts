import styled from 'styled-components';

export const LinkCard = styled.section`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.bodyColor};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  margin: 0 auto;
  max-width: 34rem;
  padding: 1.5rem;

  h2 {
    font-size: ${({ theme }) => theme.fontSizes.h3};
    margin: 0 0 0.75rem;
  }

  p {
    margin: 0 0 1rem;
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

export const CodeForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;

  label {
    display: flex;
    flex-direction: column;
    font-size: ${({ theme }) => theme.fontSizes.sm};
    gap: 0.35rem;
  }

  input {
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 4px;
    font-family: ${({ theme }) => theme.fonts.monospace};
    font-size: ${({ theme }) => theme.fontSizes.xl};
    letter-spacing: 0.15em;
    max-width: 14rem;
    padding: 0.4rem 0.6rem;
    text-transform: uppercase;
  }
`;

export const Code = styled.code`
  font-family: ${({ theme }) => theme.fonts.monospace};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  letter-spacing: 0.1em;
`;

export const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;
