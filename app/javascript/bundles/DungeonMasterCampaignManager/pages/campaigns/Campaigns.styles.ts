import styled, { css } from 'styled-components';
import * as Tabs from '@radix-ui/react-tabs';

export const PlannerWrapper = styled.div`
  color: ${({ theme }) => theme.colors.bodyColor};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
`;

export const Toolbar = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  margin: 0.5rem 0 1rem;
`;

export const ButtonRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const CardGrid = styled.div`
  display: grid;
  gap: 1rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 20rem), 1fr));
`;

export const Card = styled.div<{ $muted?: boolean }>`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  opacity: ${({ $muted }) => ($muted ? 0.65 : 1)};
  padding: 1rem;

  h3,
  h4 {
    margin: 0;
  }

  p {
    margin: 0;
    white-space: pre-wrap;
  }
`;

export const CardHeader = styled.div`
  align-items: flex-start;
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
`;

export const Meta = styled.div`
  color: ${({ theme }) => theme.colors.textMuted};
  font-size: ${({ theme }) => theme.fontSizes.sm};
`;

export const Badge = styled.span<{
  $tone?: 'primary' | 'success' | 'warning' | 'danger' | 'muted';
}>`
  border-radius: 999px;
  display: inline-block;
  font-size: ${({ theme }) => theme.fontSizes.xs};
  font-weight: bold;
  padding: 0.1rem 0.5rem;
  text-transform: uppercase;
  white-space: nowrap;

  ${({ theme, $tone = 'muted' }) => {
    const colors = {
      primary: theme.colors.primary,
      success: theme.colors.success,
      warning: theme.colors.orange,
      danger: theme.colors.danger,
      muted: theme.colors.ash,
    };
    return css`
      background: ${colors[$tone]};
      color: ${theme.colors.white};
    `;
  }}
`;

export const SectionTitle = styled.h2`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  justify-content: space-between;
  margin: 1.5rem 0 0.75rem;
`;

// A small heading inside a card, e.g. "Add a monster"
export const AddHeading = styled.h4`
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin: 0.75rem 0 0.25rem;
`;

export const EmptyState = styled.p`
  color: ${({ theme }) => theme.colors.textMuted};
  font-style: italic;
`;

export const Notice = styled.p<{ $tone?: 'danger' | 'warning' | 'success' }>`
  border-left: 4px solid
    ${({ theme, $tone = 'danger' }) => (theme.colors as Record<string, string>)[$tone]};
  margin: 0.5rem 0;
  padding: 0.25rem 0.5rem;
`;

export const List = styled.ul`
  margin: 0;
  padding-left: 1.25rem;

  li {
    margin: 0.15rem 0;
  }
`;

// Forms

export const Form = styled.form`
  display: grid;
  gap: 0.75rem;
`;

export const FormGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr));
`;

export const Field = styled.label`
  display: flex;
  flex-direction: column;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: bold;
  gap: 0.25rem;

  small {
    color: ${({ theme }) => theme.colors.textMuted};
    font-weight: normal;
  }
`;

export const CheckboxField = styled.label`
  align-items: center;
  display: flex;
  gap: 0.5rem;
`;

const inputStyles = css`
  background: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.bodyColor};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  font-weight: normal;
  padding: 0.4rem 0.5rem;
  width: 100%;
`;

export const Input = styled.input`
  ${inputStyles}
`;

export const TextArea = styled.textarea`
  ${inputStyles}
  min-height: 5rem;
  resize: vertical;
`;

export const Select = styled.select`
  ${inputStyles}
`;

export const InputWithHelper = styled.div`
  display: flex;
  gap: 0.25rem;

  > :first-child {
    flex: 1;
  }
`;

export const HelperButton = styled.button`
  background: ${({ theme }) => theme.colors.lightBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  font-weight: bold;
  padding: 0.25rem 0.5rem;
  white-space: nowrap;

  &:disabled {
    cursor: wait;
    opacity: 0.6;
  }
`;

export const LinkButton = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  cursor: pointer;
  font-size: ${({ theme }) => theme.fontSizes.sm};
  padding: 0;
  text-decoration: underline;
`;

// Tabs (wrap on small screens instead of overflowing)

export const TabsRoot = styled(Tabs.Root)`
  margin-top: 1rem;
`;

export const TabsList = styled(Tabs.List)`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  display: flex;
  flex-wrap: wrap;
  gap: 0 1rem;
`;

export const TabsTrigger = styled(Tabs.Trigger)`
  align-items: center;
  background: none;
  border: none;
  border-bottom: 0.2rem solid transparent;
  color: ${({ theme }) => theme.colors.textMuted};
  cursor: pointer;
  display: flex;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: ${({ theme }) => theme.fontSizes.lg};
  gap: 0.35rem;
  padding: 0.5rem 0.25rem;

  &[data-state='active'],
  &:hover {
    border-bottom-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

export const TabsContent = styled(Tabs.Content)`
  padding-top: 0.5rem;
`;
