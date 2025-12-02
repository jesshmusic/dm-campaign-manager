import styled from 'styled-components';
import { respondToContainer, hexToRgba, adjustLightness } from '../../theme/mixins';

export const MonsterPage = styled.div`
  ${respondToContainer.md}

  background: ${({ theme }) => theme.colors.cardBg};
  border-collapse: separate;
  border-image: ${({ theme }) => theme.borders.orangeBorder};
  border-style: solid;
  border-width: 8px;
  box-shadow: 5px 7px 15px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.5)};
  column-gap: 3rem;
  columns: 400px 2;
  padding: 1rem;

  h1,
  h2 {
    margin: 0 0 0.5rem;
  }

  h1 {
    align-items: center;
    display: flex;
    font-size: 1.625rem;
    justify-content: space-between;
    margin-bottom: 1rem;

    span {
      background-color: ${({ theme }) => hexToRgba(theme.colors.primary, 0.9)};
      border-radius: 1rem;
      display: flex;
      padding: 0.5rem 1rem;
    }

    small {
      color: ${({ theme }) => theme.colors.white};
      font-family: ${({ theme }) => theme.fonts.sansSerif};
      font-size: 0.75rem;
    }

    svg {
      fill: ${({ theme }) => theme.colors.white};
      margin-right: 0.5rem;
      stroke: ${({ theme }) => adjustLightness(theme.colors.primary, 20)};
    }
  }

  h2 {
    font-family: ${({ theme }) => theme.fonts.sansSerif};
    font-size: 1rem;
    font-style: italic;
  }

  h3 {
    border-bottom: 1px solid ${({ theme }) => theme.colors.textRed};
    color: ${({ theme }) => theme.colors.textRed};
    font-family: ${({ theme }) => theme.fonts.sansSerif};
    font-weight: normal;
  }

  hr {
    background-color: transparent;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEYAAAAeCAYAAACR82geAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwgAADsIBFShKgAAAABh0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4zjOaXUAAAAt5JREFUaEPtWTtoVEEUHf8iaEjMZt/ME6Jx3X1zlwgavyAICoL4aRWFIFYWAUURLZQo+GkUTGHc92Y2q2AKI0oKLbQIKRS0UPxCilgEFIKCTYIfyBrPi4NImGKJyWZ3Xw4cpth9b84c7ty59w3TaXdAS3FXEz8VkLtNp5YuZjNgoTGj/1KRGNEkXoEqkM4RmLamlbG55u/RwXhj7BRDMKw3kPyKkmKflk69ebxyYTeiAJL4CLO6AynOaI/v8Buqq8wrKwPWRU+Ef7bgOy3dm4p4i0456/wmNs9MU36wLnKySO4wzHqCyLoGsw4EyfiKUcZmmalLG9YFTSVJDMKkB0ryc1np7OxsrKo2UkoLVvHFJLl5GNWHpH5bS35UUXxDWyKxwMibPljFTjdJfMP2ewbDrgee06xWxhIoGWYbycWBVViJMQvCqM/go4D4Be25u/wkr4X8qctXNiFlwjwiqx9RdQfj8ZznbvI5X2SW9f+wTFi+JPEdfIHaysd4SKdEqnXrBKt26wQVQrMFv+IE7MlKcakjLfbkKOYUVDLYXljhzOMEHEBU3UMfeDJLfIu1cbY8GDmqtPiJyHoDaph1OJOqa5wxBgyNCUi8DY3pgDEqWbc6csaotPsLUTEAE+7rdES30t/kS7wHJlzGSbU349Xy6CVfEj9gwksk1yDKxzV6LPEBlXAXxhPaE5v9pogVeOGWQAR8AR/DhIuBJ3ZnE04M8iPWEqCJRIJ8jmhohynNimKJLsbmGMnFgVVYMTn22cHtgxGdgcePZWR8Y66+fqGRN32wip1KkhgEHwaSnw8/VClaVmOklBas4ieL5A7jlHiK4qlNEz/YvqquIXqfNkmMoIJ8j+R4C2a0+ElnfSux+Waa8oN1kQUwS+ITzOhWnjir05G9PhFDMKEX7ftV1Av7b6Tiy83jlYvxJmArhPdDrzHq8Io24/G1Ub2iHbvURzN1GuP2tkTNEvNThMHYbySiA8IawOrpAAAAAElFTkSuQmCC');
    background-size: 100% 100%;
    border: 0;
    height: 6px !important;
    margin: 4px 0;
    opacity: 1;
    visibility: visible;
  }
`;

export const FrameStat = styled.div`
  color: ${({ theme }) => theme.colors.textRed};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 1.05rem;
  margin: 0;

  span {
    font-size: 1rem;
    font-weight: bold;
  }
`;

export const AbilityScoresBlock = styled.div`
  display: grid;
  grid-template-columns: repeat(6, 1fr);
`;

export const AbilityScoresCol = styled.div`
  color: ${({ theme }) => theme.colors.textRed};
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: 1rem;
  text-align: center;
`;

export const AbilityScoresName = styled.div`
  font-weight: bold;
`;

export const MonsterFrameAction = styled.div`
  display: inline;
`;

export const CRStats = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-collapse: separate;
  border-image: ${({ theme }) => theme.borders.orangeBorder};
  border-style: solid;
  border-width: 5px;
  box-shadow: 2px 2px 5px ${({ theme }) => hexToRgba(theme.colors.gray900, 0.5)};
  padding: 0.5rem;
`;
