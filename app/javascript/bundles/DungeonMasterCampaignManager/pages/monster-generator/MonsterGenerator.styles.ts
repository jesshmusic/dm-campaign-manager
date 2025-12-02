import styled from 'styled-components';
import { respondToContainer, buttonGroupStyles, adjustLightness } from '../../theme/mixins';

// Main wrapper
export const MonsterGenWrapper = styled.div`
  ${respondToContainer.md}
`;

// Generator Form styles
export const GenForm = styled.form`
  button {
    margin: 0.5rem 0.5rem 0 0;
  }

  h4 {
    border-bottom: ${({ theme }) => theme.colors.orange} solid 0.05rem;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.h5};
    font-weight: normal;
    margin: 1.25rem 0 0.75rem;
    padding-bottom: 0.25rem;
  }
`;

export const Challenge = styled.div`
  button {
    margin: 0;
  }
`;

// Grid layouts
export const TwoCol = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(2, 1fr);
  margin-bottom: 1rem;
`;

export const ThreeCol = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(3, 1fr);
  margin-bottom: 1rem;
`;

export const FourCol = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(4, 1fr);
  margin-bottom: 1rem;
`;

export const FiveCol = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(5, 1fr);
  margin-bottom: 1rem;
`;

export const SixCol = styled.div`
  display: grid;
  grid-gap: 0.5rem;
  grid-template-columns: repeat(6, 1fr);
  margin-bottom: 1rem;
`;

export const LargeInputs = styled.div`
  .reactSelect__control,
  input {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

// Ability Score Field styles
export const AbilityWrapper = styled.div`
  button {
    border: 0.0625rem solid ${({ theme }) => theme.colors.gray400};
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    margin: 0 0 -0.0625rem;
    padding: 0.5rem;
    white-space: nowrap;
    width: 100%;

    &:first-child {
      flex: 3;
      margin-right: -0.0625rem;
    }

    &:last-child {
      flex: 2;
    }

    svg {
      margin-left: auto;
    }
  }
`;

export const AbilityButtonGroup = styled.div`
  ${buttonGroupStyles}
  padding: 0;
`;

export const AbilityInput = styled.input`
  border-top-left-radius: 0;
  border-top-right-radius: 0;
`;

export const AbilityGroup = styled.div`
  display: flex;
  position: relative;
`;

export const AbilInput = styled.div`
  flex: 3;
`;

export const ModField = styled.div`
  flex: 2;
  position: relative;

  input {
    text-align: center;
  }

  &::after {
    content: ')';
    height: 100%;
    position: absolute;
    right: 0.5rem;
    top: 0.7rem;
  }

  &::before {
    content: '(';
    height: 100%;
    left: 0.5rem;
    position: absolute;
    top: 0.7rem;
  }
`;

export const Label = styled.div`
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  margin-bottom: 0.25rem;
`;

// Dice Fields styles
export const DiceContainer = styled.div`
  display: flex;
`;

export const DieCount = styled.div`
  flex: 1;
`;

export const DiceSelect = styled.div`
  flex: 1;
`;

// Field Array Form styles
export const FormContainer = styled.div`
  background-color: transparent;
  color: ${({ theme }) => theme.colors.bodyColor};
  display: flex;
  gap: 0.5rem;
  padding: 0.25rem 0;
`;

export const FormElementSelect = styled.div`
  flex: 2;
`;

export const FormElementInput = styled.div`
  flex: 1;
`;

// Action Form styles
export const ActionContainer = styled.div`
  background-color: ${({ theme }) => adjustLightness(theme.colors.brown, 15)};
  border-radius: 0.25rem;
  color: ${({ theme }) => theme.colors.white};
  margin-bottom: 1rem;
  padding: 1rem;
`;

export const ActionContent = styled.div``;

export const ActionWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-bottom: 1rem;
`;

export const SubformWrapper = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-bottom: 1rem;
`;

export const SpellSlots = styled.div`
  display: flex;
  gap: 0.5rem;
  padding-bottom: 1rem;
`;

export const ActionCol = styled.div`
  flex: 1;
`;

export const Checkbox = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  padding-left: 1.5rem;
`;

export const DiceGroup = styled.div`
  align-items: center;
  display: flex;
  flex: 1;
  gap: 0.5rem;

  > div {
    flex: 1;
  }
`;

// Name Form Field styles
export const NameFieldWrapper = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.25rem;
  position: relative;
`;

export const NameFieldLabel = styled.label`
  color: ${({ theme }) => theme.colors.bodyColor};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: 0.25rem;
`;

export const NameFieldInput = styled.input`
  background-color: ${({ theme }) => theme.colors.white};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray400};
  border-radius: ${({ theme }) => theme.borders.borderRadius};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: 0.5rem 0.75rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: 0;
  }
`;

export const NameFieldError = styled.p`
  color: ${({ theme }) => theme.colors.danger};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  margin: 0.25rem 0 0;

  svg {
    margin-right: 0.25rem;
  }
`;

export const MonsterTypeButtons = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// Combined layout helpers
export const ThreeColLarge = styled(ThreeCol)`
  .reactSelect__control,
  input {
    font-size: ${({ theme }) => theme.fontSizes.lg};
  }
`;

// Challenge Rating Field styles
export const ChallengeWrapper = styled.div`
  align-items: stretch;
  display: flex;
  flex-direction: column;
  margin-bottom: 0.25rem;
  position: relative;

  button {
    margin: 0;
  }
`;

export const ChallengeLabel = styled.label`
  color: ${({ theme }) => theme.colors.bodyColor};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  margin-bottom: 0.25rem;
`;

export const ChallengeInputGroup = styled.div`
  display: flex;
  gap: 0;

  input {
    border-bottom-right-radius: 0;
    border-right: 0;
    border-top-right-radius: 0;
    flex: 1;
  }

  button {
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }
`;

export const ChallengeInput = styled.input`
  background-color: ${({ theme }) => theme.colors.white};
  border: 0.0625rem solid ${({ theme }) => theme.colors.gray400};
  border-radius: ${({ theme }) => theme.borders.borderRadius};
  color: ${({ theme }) => theme.colors.gray600};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: 0.5rem 0.75rem;

  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
    outline: 0;
  }
`;

// Attack Form styles
export const AttackWrapper = styled.div``;

export const DiceSelectField = styled.div`
  flex: 1;
`;

// Spellcasting Form styles
export const SpellsForm = styled.div`
  h5 {
    border-bottom: ${({ theme }) => theme.colors.orange} solid 0.05rem;
    color: ${({ theme }) => theme.colors.primary};
    font-size: ${({ theme }) => theme.fontSizes.h6};
    font-weight: normal;
    margin: 1rem 0 0.75rem;
    padding-bottom: 0.25rem;
  }
`;

// Actions Section
export const ActionsSection = styled.div``;
