import styled from 'styled-components';
import { respondToContainer } from '../../theme/mixins';

export const SpellWrapper = styled.div`
  ${respondToContainer.md}

  font-size: ${({ theme }) => theme.fontSizes.base};
  padding: 0 1rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

export const SpellDescription = styled.div`
  font-style: italic;
  margin-bottom: 1rem;
  margin-top: calc(${({ theme }) => theme.spacing.spacer} * -1);
`;
