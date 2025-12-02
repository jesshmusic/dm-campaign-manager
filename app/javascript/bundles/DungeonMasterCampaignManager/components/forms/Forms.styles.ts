/**
 * Styled components for Forms
 * Migrated from input.module.scss
 */

import styled, { css } from 'styled-components';
import { formInputStyles, buttonGroupStyles } from '../../theme/mixins';

export const FormInput = styled.input`
  ${formInputStyles}
`;

export const FormTextArea = styled.textarea`
  ${formInputStyles}
`;

export const FormWrapper = styled.div``;

export const CheckboxWrapper = styled.div`
  display: block;
  margin-bottom: 0.5rem;
  min-height: 1.5rem;
  padding-left: 1.5rem;
`;

export const Checkbox = styled.input`
  appearance: none;
  background-color: ${({ theme }) => theme.colors.white};
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  border: 1px solid ${({ theme }) => theme.colors.gray800};
  height: 1.25rem;
  margin: 0 0.5rem 0 0;
  vertical-align: middle;
  width: 1.25rem;

  &[type='checkbox'] {
    border-radius: 0.15rem;
  }

  &:checked {
    background-color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => theme.colors.white};

    &[type='checkbox'] {
      background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3e%3cpath fill='none' stroke='%23fff' stroke-linecap='round' stroke-linejoin='round' stroke-width='3' d='M6 10l3 3l6-6'/%3e%3c/svg%3e");
    }
  }
`;

export const CheckboxLabel = styled.label`
  display: inline-block;
  margin-bottom: 0;
`;

export const ButtonGroup = styled.div`
  ${buttonGroupStyles}
`;

export const ErrorMessage = styled.p`
  align-items: center;
  color: ${({ theme }) => theme.colors.danger};
  display: flex;
  margin-top: 0.25rem;
`;

export const InputGroup = styled.div`
  align-items: stretch;
  display: flex;
  flex-wrap: nowrap;
  position: relative;
  width: 100%;

  ${FormInput} {
    border-bottom-right-radius: 0;
    border-top-right-radius: 0;
    flex: 1;
    position: relative;
  }

  button {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
    margin: 0;
  }
`;

export const FormLabel = styled.label`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  margin-bottom: 0.25rem;
`;

export const TagInputContainer = styled.div`
  background-color: ${({ theme }) => theme.colors.white};
  border: 1px solid ${({ theme }) => theme.colors.gray400};
  border-radius: 0.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 2.5rem;
  padding: 0.5rem;

  &:focus-within {
    border-color: ${({ theme }) => theme.colors.primary};
    outline: none;
  }
`;

export const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

export const TagPill = styled.span`
  align-items: center;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors.white};
  display: inline-flex;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 0.875rem;
  font-weight: 500;
  gap: 0.25rem;
  padding: 0.5rem 0.75rem;
`;

export const TagRemove = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.white};
  cursor: pointer;
  font-size: 1.125rem;
  font-weight: bold;
  line-height: 1;
  margin-left: 0.5rem;
  opacity: 0.8;
  padding: 0;
  transition: opacity 0.15s ease-in-out;

  &:hover {
    opacity: 1;
  }
`;

export const TagInputField = styled.input`
  background: transparent;
  border: none;
  color: ${({ theme }) => theme.colors.gray900} !important;
  flex: 1;
  font-family: ${({ theme }) => theme.fonts.serif};
  font-size: 1rem;
  padding: 0.25rem 0;
  -webkit-text-fill-color: ${({ theme }) => theme.colors.gray900};

  &:focus {
    color: ${({ theme }) => theme.colors.gray900} !important;
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.colors.gray600};
    opacity: 0.6;
  }
`;
