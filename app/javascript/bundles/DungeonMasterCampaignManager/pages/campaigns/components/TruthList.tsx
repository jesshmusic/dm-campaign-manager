import styled from 'styled-components';
import { Truth } from '../types';

const List = styled.ol`
  margin: 0;
  padding-left: 1.5rem;

  li {
    margin: 0.25rem 0;
  }
`;

type TruthListProps = {
  truths: Truth[];
  // Names the list for screen readers, e.g. "Truths of the setting"
  label?: string;
};

/** The truths of the setting, numbered: each name in bold, then its description */
const TruthList = ({ truths, label }: TruthListProps) => (
  <List aria-label={label}>
    {truths.map((truth, index) => (
      // Truths have no ids; names can repeat while the DM is writing them
      <li key={index}>
        <strong>{truth.name}</strong>
        {truth.description && <> {truth.description}</>}
      </li>
    ))}
  </List>
);

export default TruthList;
