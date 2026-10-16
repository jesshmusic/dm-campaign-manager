import { CompendiumPack } from '../types';
import { CheckboxField, Meta } from '../Campaigns.styles';
import styled from 'styled-components';

const Group = styled.fieldset`
  border: none;
  margin: 0.75rem 0 0;
  padding: 0;

  legend {
    font-size: ${({ theme }) => theme.fontSizes.base};
    font-weight: bold;
    margin-bottom: 0.25rem;
    padding: 0;
  }
`;

type CompendiumPickerProps = {
  // null while loading
  packs: CompendiumPack[] | null;
  excluded: string[];
  onChange: (excluded: string[]) => void;
  disabled?: boolean;
};

/**
 * Checkboxes for the Foundry compendiums a campaign searches, grouped by
 * book, with one to turn them all on or off. Saves the ones turned off, so a
 * compendium indexed later is on by default.
 */
const CompendiumPicker = ({ packs, excluded, onChange, disabled }: CompendiumPickerProps) => {
  if (!packs) return <Meta>Loading compendiums…</Meta>;
  if (packs.length === 0)
    return (
      <Meta>
        No compendiums yet. Install Dorman Lakely&apos;s Campaign Planner in Foundry and link it to
        Dungeon Master Guru. It sends the index of your SRD and 2024 core book compendiums here, so
        monsters and items you pick become links you can drag onto a scene.
      </Meta>
    );

  const ids = packs.map((pack) => pack.pack);
  const onCount = ids.filter((id) => !excluded.includes(id)).length;
  const allOn = onCount === ids.length;

  // Keeps exclusions for packs not shown here (e.g. from another Foundry world)
  const setAll = (on: boolean) =>
    onChange(on ? excluded.filter((id) => !ids.includes(id)) : [...new Set([...excluded, ...ids])]);
  const toggle = (id: string) =>
    onChange(excluded.includes(id) ? excluded.filter((other) => other !== id) : [...excluded, id]);

  const books = [...new Set(packs.map((pack) => pack.bookName))];

  return (
    <>
      <CheckboxField>
        <input
          type="checkbox"
          checked={allOn}
          disabled={disabled}
          ref={(input) => {
            if (input) input.indeterminate = onCount > 0 && !allOn;
          }}
          onChange={() => setAll(!allOn)}
        />
        <strong>All compendiums</strong>
      </CheckboxField>
      {books.map((book) => (
        <Group key={book}>
          <legend>{book}</legend>
          {packs
            .filter((pack) => pack.bookName === book)
            .map((pack) => (
              <CheckboxField key={pack.pack}>
                <input
                  type="checkbox"
                  checked={!excluded.includes(pack.pack)}
                  disabled={disabled}
                  onChange={() => toggle(pack.pack)}
                />
                {pack.label} <Meta as="span">({pack.count})</Meta>
              </CheckboxField>
            ))}
        </Group>
      ))}
    </>
  );
};

export default CompendiumPicker;
