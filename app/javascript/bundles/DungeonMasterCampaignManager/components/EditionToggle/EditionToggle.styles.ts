import styled from 'styled-components';

export const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-bottom: 2px solid ${({ theme }) => theme.sidebar.borderColor};
`;

export const ToggleLabel = styled.span`
  color: ${({ theme }) => theme.colors.white};
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 0.875rem;
  margin-right: 0.5rem;
`;

export const ToggleWrapper = styled.div`
  display: flex;
  background-color: rgba(71, 21, 13, 0.5);
  border-radius: 1rem;
  overflow: hidden;
`;

interface ToggleButtonProps {
  $isActive: boolean;
}

export const ToggleButton = styled.button<ToggleButtonProps>`
  background-color: ${({ $isActive }) => ($isActive ? 'rgba(127, 81, 62, 0.9)' : 'transparent')};
  border: none;
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.white : '#efb3ab')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 0.75rem;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
  padding: 0.25rem 0.75rem;
  transition: all 0.2s ease-in-out;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? 'rgba(127, 81, 62, 0.9)' : 'rgba(127, 81, 62, 0.3)'};
    color: ${({ theme }) => theme.colors.white};
  }

  &:first-child {
    border-radius: 1rem 0 0 1rem;
  }

  &:last-child {
    border-radius: 0 1rem 1rem 0;
  }
`;

export const CollapsedToggle = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 0.5rem;
  border-bottom: 2px solid ${({ theme }) => theme.sidebar.borderColor};
`;

export const CollapsedButton = styled.button<ToggleButtonProps>`
  background-color: ${({ $isActive }) => ($isActive ? 'rgba(127, 81, 62, 0.9)' : 'transparent')};
  border: 1px solid ${({ $isActive }) => ($isActive ? 'rgba(201, 173, 106, 0.5)' : 'transparent')};
  border-radius: 0.25rem;
  color: ${({ $isActive, theme }) => ($isActive ? theme.colors.white : '#efb3ab')};
  cursor: pointer;
  font-family: ${({ theme }) => theme.fonts.mrEaves};
  font-size: 0.875rem;
  font-weight: ${({ $isActive }) => ($isActive ? 'bold' : 'normal')};
  margin: 0.125rem 0;
  padding: 0.35rem 0.5rem;
  transition: all 0.2s ease-in-out;
  width: 100%;

  &:hover {
    background-color: ${({ $isActive }) =>
      $isActive ? 'rgba(127, 81, 62, 0.9)' : 'rgba(127, 81, 62, 0.3)'};
    color: ${({ theme }) => theme.colors.white};
  }
`;
