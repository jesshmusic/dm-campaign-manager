import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Truth } from '../types';
import {
  emptyTruth,
  MAX_TRUTH_DESCRIPTION_LENGTH,
  MAX_TRUTH_NAME_LENGTH,
  MAX_TRUTHS,
} from '../truths';
import { HelperButton, Input, LinkButton, Meta, TextArea } from '../Campaigns.styles';

const Rows = styled.ol`
  display: grid;
  gap: 0.75rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Row = styled.li`
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  display: grid;
  font-weight: normal;
  gap: 0.25rem 0.5rem;
  grid-template-columns: auto minmax(0, 1fr);
  padding: 0.5rem;
`;

const RowNumber = styled.span`
  font-weight: bold;
  padding-top: 0.4rem;
`;

const Inputs = styled.div`
  display: grid;
  gap: 0.25rem;

  textarea {
    min-height: 3.5rem;
  }
`;

const Actions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.75rem;
  grid-column: 2;

  button:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: default;
    opacity: 0.5;
    text-decoration: none;
  }
`;

const AddButton = styled(HelperButton)`
  &:disabled {
    cursor: default;
  }
`;

const AddRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

// Where focus goes once the list has changed
type Focus = { index: number; control: 'name' | 'up' | 'down' } | 'add';

type TruthsEditorProps = {
  truths: Truth[];
  onChange: (truths: Truth[]) => void;
};

/**
 * The truths of the setting as a numbered list the DM builds one at a time:
 * each a short name ("Greyhawk runs on gold.") and a description of what it
 * means. Rows can be moved and removed. Nothing is saved here; the form
 * around it saves the list.
 */
const TruthsEditor = ({ truths, onChange }: TruthsEditorProps) => {
  const controls = useRef(new Map<string, HTMLElement | null>());
  const addButton = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<Focus | null>(null);

  // After adding, moving or removing a truth, keep focus where the DM is working
  useEffect(() => {
    const focus = pendingFocus.current;
    if (!focus) return;
    pendingFocus.current = null;
    if (focus === 'add') addButton.current?.focus();
    else controls.current.get(`${focus.control}-${focus.index}`)?.focus();
  });

  const control = (key: string) => (element: HTMLElement | null) => {
    controls.current.set(key, element);
  };

  const change = (index: number, changes: Partial<Truth>) =>
    onChange(truths.map((truth, i) => (i === index ? { ...truth, ...changes } : truth)));

  const add = () => {
    pendingFocus.current = { index: truths.length, control: 'name' };
    onChange([...truths, emptyTruth()]);
  };

  const move = (index: number, by: -1 | 1) => {
    const to = index + by;
    const moved = [...truths];
    [moved[index], moved[to]] = [moved[to], moved[index]];
    // Stay on the same button, unless the row has reached the end of the list
    const atEnd = by < 0 ? to === 0 : to === truths.length - 1;
    const sameButton = by < 0 ? 'up' : 'down';
    const otherButton = by < 0 ? 'down' : 'up';
    pendingFocus.current = { index: to, control: atEnd ? otherButton : sameButton };
    onChange(moved);
  };

  const remove = (index: number) => {
    const rest = truths.filter((_, i) => i !== index);
    pendingFocus.current =
      rest.length === 0 ? 'add' : { index: Math.min(index, rest.length - 1), control: 'name' };
    onChange(rest);
  };

  const full = truths.length >= MAX_TRUTHS;

  return (
    <div>
      {truths.length > 0 && (
        <Rows aria-label="Truths">
          {truths.map((truth, index) => {
            const number = index + 1;
            return (
              // Rows have no ids; each is its place in the list
              <Row key={index}>
                <RowNumber aria-hidden>{number}.</RowNumber>
                <Inputs>
                  <Input
                    ref={control(`name-${index}`)}
                    type="text"
                    aria-label={`Truth ${number} name`}
                    placeholder="A short fact, e.g. Greyhawk runs on gold."
                    maxLength={MAX_TRUTH_NAME_LENGTH}
                    value={truth.name}
                    onChange={(e) => change(index, { name: e.target.value })}
                  />
                  <TextArea
                    aria-label={`Truth ${number} description`}
                    placeholder="What it means at the table (optional)"
                    maxLength={MAX_TRUTH_DESCRIPTION_LENGTH}
                    value={truth.description}
                    onChange={(e) => change(index, { description: e.target.value })}
                  />
                </Inputs>
                <Actions>
                  <LinkButton
                    ref={control(`up-${index}`)}
                    type="button"
                    aria-label={`Move truth ${number} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    Up
                  </LinkButton>
                  <LinkButton
                    ref={control(`down-${index}`)}
                    type="button"
                    aria-label={`Move truth ${number} down`}
                    disabled={index === truths.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    Down
                  </LinkButton>
                  <LinkButton
                    type="button"
                    aria-label={`Remove truth ${number}`}
                    onClick={() => remove(index)}
                  >
                    Remove
                  </LinkButton>
                </Actions>
              </Row>
            );
          })}
        </Rows>
      )}
      <AddRow>
        <AddButton ref={addButton} type="button" disabled={full} onClick={add}>
          Add a truth
        </AddButton>
        {full && <Meta as="span">That&apos;s as many as a campaign can have.</Meta>}
      </AddRow>
    </div>
  );
};

export default TruthsEditor;
