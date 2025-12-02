import styled from 'styled-components';
import { respondToContainer, buttonBarStyles } from '../../theme/mixins';

export const Wrapper = styled.div`
  ${respondToContainer.md}
`;

export const Section = styled.div`
  padding: ${({ theme }) => theme.spacing.spacer} 0;
  width: 100%;
`;

export const ButtonBar = styled.div`
  ${buttonBarStyles}
  margin: calc(${({ theme }) => theme.spacing.spacer} * 0.5) 0;
`;

export const ButtonBarGreen = styled.div`
  ${buttonBarStyles}
  background-color: ${({ theme }) => theme.colors.green};
  margin: calc(${({ theme }) => theme.spacing.spacer} * 0.5) 0;
`;

export const ActionTypeContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
  padding: calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const InfoContainer = styled.div`
  display: grid;
  grid-gap: ${({ theme }) => theme.spacing.spacer};
  grid-template-columns: 1fr 1fr;

  p {
    color: ${({ theme }) => theme.colors.primaryDark};
    display: grid;
    font-size: calc(${({ theme }) => theme.fontSizes.lg} * 0.85);
    grid-template-columns: 2fr 1fr;
    max-width: 25rem;
  }
`;

export const EditButton = styled.span`
  margin-right: 0.5rem;
`;

export const WidgetFormWrapper = styled.form`
  label {
    font-family: ${({ theme }) => theme.fonts.sansSerif};
    font-size: ${({ theme }) => theme.fontSizes.lg};
    padding: 0 0 0.5rem;
  }

  input {
    margin-bottom: 1rem;
  }
`;

export const SelectRow = styled.div`
  margin-bottom: 1rem;
  z-index: 100;
`;
