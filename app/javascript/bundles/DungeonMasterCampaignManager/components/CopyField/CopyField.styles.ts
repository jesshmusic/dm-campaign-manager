/**
 * Styled components for CopyField
 * Migrated from copy-field.module.scss
 */

import styled, { css } from 'styled-components';
import { formInputStyles } from '../../theme/mixins';

export const CopyFieldWrapper = styled.div`
  padding: calc(${({ theme }) => theme.spacing.spacer} * 0.5) 0
    calc(${({ theme }) => theme.spacing.spacer} * 0.5);
`;

export const Label = styled.label`
  display: inline-block;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
`;

const inputBaseStyles = css`
  ${formInputStyles}
  background-color: ${({ theme }) => theme.colors.backgroundColor};
  padding-left: 0.5rem;
`;

export const Input = styled.input`
  ${inputBaseStyles}
  border-top-left-radius: 0.35rem;
  border-top-right-radius: 0.35rem;
  cursor: pointer;
`;

export const TextArea = styled.textarea`
  ${inputBaseStyles}
  border: 0;
  border-radius: 0.25rem;
  height: auto;
  white-space: pre-wrap;
`;

export const HelpText = styled.small`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin-top: 0.25rem;
`;
