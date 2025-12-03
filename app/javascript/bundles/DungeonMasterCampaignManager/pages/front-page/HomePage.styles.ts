import styled from 'styled-components';
import { respondToContainer } from '../../theme/mixins';

export const Wrapper = styled.div`
  ${respondToContainer.md}
`;

export const Section = styled.div`
  padding: 1rem 0;
  width: 100%;
`;
