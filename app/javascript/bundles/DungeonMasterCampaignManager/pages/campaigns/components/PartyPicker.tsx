import styled from 'styled-components';
import { PlayerCharacter } from '../types';
import { Meta } from '../Campaigns.styles';

const Table = styled.table`
  border-collapse: collapse;
  margin-bottom: 0.75rem;
  width: 100%;

  caption {
    caption-side: top;
    color: inherit;
    font-weight: bold;
    padding-bottom: 0.25rem;
    text-align: left;
  }

  th,
  td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
    padding: 0.35rem 0.5rem 0.35rem 0;
    text-align: left;
  }

  th {
    font-size: ${({ theme }) => theme.fontSizes.sm};
  }

  td:first-child,
  th:first-child {
    width: 2rem;
  }
`;

type PartyPickerProps = {
  // null while loading
  characters: PlayerCharacter[] | null;
  selected: string[];
  onChange: (selected: string[]) => void;
  disabled?: boolean;
};

/**
 * The DM's player characters from Foundry, one table per world, with a
 * checkbox to put each one in the party.
 */
const PartyPicker = ({ characters, selected, onChange, disabled }: PartyPickerProps) => {
  if (!characters) return <Meta>Loading characters…</Meta>;
  if (characters.length === 0)
    return (
      <Meta>
        No player characters yet. In Foundry, install Dorman Lakely&apos;s Campaign Planner and link
        it to Dungeon Master Guru. It sends your worlds&apos; player characters here, with their
        full character sheets.
      </Meta>
    );

  const toggle = (id: string) =>
    onChange(selected.includes(id) ? selected.filter((other) => other !== id) : [...selected, id]);
  const worlds = [...new Set(characters.map((character) => character.worldId))];

  return (
    <>
      {worlds.map((worldId) => {
        const inWorld = characters.filter((character) => character.worldId === worldId);
        return (
          <Table key={worldId}>
            <caption>{inWorld[0].worldTitle}</caption>
            <thead>
              <tr>
                <th aria-label="In the party" />
                <th>Name</th>
                <th>Class</th>
                <th>Level</th>
                <th>Player</th>
              </tr>
            </thead>
            <tbody>
              {inWorld.map((character) => (
                <tr key={character.id}>
                  <td>
                    <input
                      type="checkbox"
                      aria-label={`${character.name} is in the party`}
                      checked={selected.includes(character.id)}
                      disabled={disabled}
                      onChange={() => toggle(character.id)}
                    />
                  </td>
                  <td>{character.name}</td>
                  <td>{character.classes ?? '—'}</td>
                  <td>{character.level ?? '—'}</td>
                  <td>{character.playerName ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        );
      })}
    </>
  );
};

export default PartyPicker;
