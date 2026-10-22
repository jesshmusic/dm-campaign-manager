import { useEffect, useRef } from 'react';
import styled from 'styled-components';
import { HelperButton, Input, LinkButton, Meta } from '../Campaigns.styles';

const Rows = styled.ol`
  display: grid;
  gap: 0.4rem;
  list-style: none;
  margin: 0;
  padding: 0;
`;

const Row = styled.li`
  align-items: center;
  display: grid;
  font-weight: normal;
  gap: 0.5rem;
  grid-template-columns: auto minmax(0, 1fr) auto;
`;

const RowNumber = styled.span`
  font-weight: bold;
`;

const Actions = styled.div`
  display: flex;
  gap: 0 0.75rem;

  button:disabled {
    color: ${({ theme }) => theme.colors.textMuted};
    cursor: default;
    opacity: 0.5;
    text-decoration: none;
  }
`;

const AddRow = styled.div`
  align-items: center;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 0.5rem;
`;

const AddButton = styled(HelperButton)`
  &:disabled {
    cursor: default;
  }
`;

// Where focus goes once the list has changed
type Focus = { index: number; control: 'item' | 'up' | 'down' } | 'add';

type ListEditorProps = {
  // What one row is, for labels: "portent" gives "Portent 2" and "Add a portent"
  noun: string;
  items: string[];
  onChange: (items: string[]) => void;
  // How many rows there can be
  max: number;
  placeholder?: string;
  maxLength?: number;
};

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

/**
 * A list of short lines the DM builds a row at a time, like a to-do list: a
 * box per row, with buttons to move or remove it, and one to add another.
 * Used for grim portents, stakes, features and potential scenes. Nothing is
 * saved here; the form around it saves the list.
 */
const ListEditor = ({
  noun,
  items,
  onChange,
  max,
  placeholder,
  maxLength = 300,
}: ListEditorProps) => {
  const controls = useRef(new Map<string, HTMLElement | null>());
  const addButton = useRef<HTMLButtonElement>(null);
  const pendingFocus = useRef<Focus | null>(null);

  // After adding, moving or removing a row, keep focus where the DM is working
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

  const change = (index: number, value: string) =>
    onChange(items.map((item, i) => (i === index ? value : item)));

  const add = () => {
    pendingFocus.current = { index: items.length, control: 'item' };
    onChange([...items, '']);
  };

  const move = (index: number, by: -1 | 1) => {
    const to = index + by;
    const moved = [...items];
    [moved[index], moved[to]] = [moved[to], moved[index]];
    // Stay on the same button, unless the row has reached the end of the list
    const atEnd = by < 0 ? to === 0 : to === items.length - 1;
    const sameButton = by < 0 ? 'up' : 'down';
    const otherButton = by < 0 ? 'down' : 'up';
    pendingFocus.current = { index: to, control: atEnd ? otherButton : sameButton };
    onChange(moved);
  };

  const remove = (index: number) => {
    const rest = items.filter((_, i) => i !== index);
    pendingFocus.current =
      rest.length === 0 ? 'add' : { index: Math.min(index, rest.length - 1), control: 'item' };
    onChange(rest);
  };

  const full = items.length >= max;
  const article = /^[aeiou]/i.test(noun) ? 'an' : 'a';

  return (
    <div>
      {items.length > 0 && (
        <Rows aria-label={`${capitalize(noun)}s`}>
          {items.map((item, index) => {
            const number = index + 1;
            return (
              // Rows have no ids; each is its place in the list
              <Row key={index}>
                <RowNumber aria-hidden>{number}.</RowNumber>
                <Input
                  ref={control(`item-${index}`)}
                  type="text"
                  aria-label={`${capitalize(noun)} ${number}`}
                  placeholder={placeholder}
                  maxLength={maxLength}
                  value={item}
                  onChange={(e) => change(index, e.target.value)}
                />
                <Actions>
                  <LinkButton
                    ref={control(`up-${index}`)}
                    type="button"
                    aria-label={`Move ${noun} ${number} up`}
                    disabled={index === 0}
                    onClick={() => move(index, -1)}
                  >
                    Up
                  </LinkButton>
                  <LinkButton
                    ref={control(`down-${index}`)}
                    type="button"
                    aria-label={`Move ${noun} ${number} down`}
                    disabled={index === items.length - 1}
                    onClick={() => move(index, 1)}
                  >
                    Down
                  </LinkButton>
                  <LinkButton
                    type="button"
                    aria-label={`Remove ${noun} ${number}`}
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
          Add {article} {noun}
        </AddButton>
        {full && <Meta as="span">That&apos;s {max}, as many as this can have.</Meta>}
      </AddRow>
    </div>
  );
};

/** The rows worth saving: trimmed, without empty ones */
export const listToSave = (items: string[]) => items.map((item) => item.trim()).filter(Boolean);

export default ListEditor;
