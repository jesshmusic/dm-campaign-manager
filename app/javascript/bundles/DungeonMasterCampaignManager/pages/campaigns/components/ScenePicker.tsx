import { useState } from 'react';
import styled from 'styled-components';
import useLoadedList from '../useLoadedList';
import SceneThumbnail, { SceneGallery } from './SceneThumbnail';
import { FoundryScene, FoundrySceneSummary } from '../types';
import { ButtonRow, EmptyState, HelperButton, Input, LinkButton, Meta } from '../Campaigns.styles';

// As many maps as a session or quest can have, and the longest name it keeps
export const MAX_MAPS = 20;
const MAX_NAME = 120;

export const NO_SCENES_TEXT =
  "Your Foundry scenes appear here once Dorman Lakely's Campaign Planner is connected with sync. " +
  'It sends a thumbnail of each scene with a map image.';

const Chosen = styled.li`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

const Controls = styled(ButtonRow)`
  align-items: center;
  margin-top: 0.5rem;
`;

const Browser = styled.div`
  background: ${({ theme }) => theme.colors.lightBg};
  border: 1px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-top: 0.5rem;
  max-height: 32rem;
  overflow-y: auto;
  padding: 0.75rem;

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin: 0 0 0.35rem;
  }
`;

const OptionGrid = styled.ul`
  display: grid;
  gap: 0.5rem;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 9rem), 1fr));
  list-style: none;
  margin: 0;
  padding: 0;
`;

const SceneOption = styled.button`
  background: ${({ theme }) => theme.colors.white};
  border: 2px solid ${({ theme }) => theme.colors.borderColor};
  border-radius: 4px;
  color: ${({ theme }) => theme.colors.bodyColor};
  cursor: pointer;
  display: flex;
  flex-direction: column;
  font-family: ${({ theme }) => theme.fonts.sansSerif};
  font-size: ${({ theme }) => theme.fontSizes.sm};
  gap: 0.25rem;
  height: 100%;
  padding: 0.25rem;
  text-align: left;
  width: 100%;

  img {
    aspect-ratio: 16 / 9;
    background: ${({ theme }) => theme.colors.borderColor};
    border-radius: 2px;
    object-fit: cover;
    width: 100%;
  }

  &[aria-pressed='true'] {
    border-color: ${({ theme }) => theme.colors.primary};
    box-shadow: ${({ theme }) => theme.shadows.btnFocus};
    font-weight: bold;
  }

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.primary};
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.55;
  }
`;

type World = { id: string; title: string; scenes: FoundrySceneSummary[] };

// Scenes grouped by world, keeping the server's order (world title, then name)
const byWorld = (scenes: FoundrySceneSummary[]): World[] =>
  scenes.reduce<World[]>((worlds, scene) => {
    const world = worlds.find((w) => w.id === scene.worldId);
    if (world) world.scenes.push(scene);
    else
      worlds.push({ id: scene.worldId, title: scene.worldTitle ?? scene.worldId, scenes: [scene] });
    return worlds;
  }, []);

type SceneBrowserProps = {
  label: string;
  load: () => Promise<FoundrySceneSummary[]>;
  chosen: FoundryScene[];
  multiple: boolean;
  saving: boolean;
  onPick: (scene: FoundrySceneSummary) => void;
};

/** The DM's Foundry scenes, searchable, one grid of thumbnails per world. */
const SceneBrowser = ({ label, load, chosen, multiple, saving, onPick }: SceneBrowserProps) => {
  const scenes = useLoadedList(load);
  const [query, setQuery] = useState('');

  if (!scenes) return <Meta>Loading your Foundry scenes…</Meta>;
  if (scenes.length === 0) return <EmptyState>{NO_SCENES_TEXT}</EmptyState>;

  const search = query.trim().toLowerCase();
  const matching = search
    ? scenes.filter((scene) => scene.name.toLowerCase().includes(search))
    : scenes;
  const full = multiple && chosen.length >= MAX_MAPS;

  return (
    <>
      <Input
        type="search"
        aria-label="Search scenes"
        placeholder="Search scenes"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />
      {full && <Meta>That&apos;s the most maps it can have ({MAX_MAPS}).</Meta>}
      {matching.length === 0 && <Meta>No scenes match &ldquo;{query.trim()}&rdquo;.</Meta>}
      {byWorld(matching).map((world) => (
        <section key={world.id} aria-label={`${label}: ${world.title}`}>
          <h4>{world.title}</h4>
          <OptionGrid>
            {world.scenes.map((scene) => {
              const picked = chosen.some((other) => other.uuid === scene.uuid);
              return (
                <li key={scene.uuid}>
                  <SceneOption
                    type="button"
                    aria-pressed={picked}
                    disabled={saving || (full && !picked)}
                    onClick={() => onPick(scene)}
                  >
                    <img src={scene.thumbnailUrl} alt="" loading="lazy" />
                    {scene.name}
                  </SceneOption>
                </li>
              );
            })}
          </OptionGrid>
        </section>
      ))}
    </>
  );
};

type ScenePickerProps = {
  // Names the chosen maps and the scene list, e.g. "Maps for Stop the cult"
  label: string;
  chosen: FoundryScene[];
  // The campaign's sceneThumbnails
  thumbnails: Record<string, string>;
  // Loads the DM's scenes, e.g. the campaign api's listFoundryScenes
  load: () => Promise<FoundrySceneSummary[]>;
  // Several maps (a session or quest), or one (a place)
  multiple?: boolean;
  emptyText?: string;
  onChange: (scenes: FoundryScene[]) => Promise<boolean>;
};

/**
 * Maps from the DM's Foundry scenes: the chosen ones as thumbnails, each
 * removable, and a searchable list of every scene Dorman Lakely's Campaign
 * Planner has sent, by world, to pick from. Saves each change as it's made.
 */
const ScenePicker = ({
  label,
  chosen,
  thumbnails,
  load,
  multiple = false,
  emptyText,
  onChange,
}: ScenePickerProps) => {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');

  const save = async (scenes: FoundryScene[]) => {
    setStatus('saving');
    const saved = await onChange(scenes);
    setStatus(saved ? 'idle' : 'error');
    return saved;
  };

  const pick = async (scene: FoundrySceneSummary) => {
    const picked = chosen.some((other) => other.uuid === scene.uuid);
    const choice = { uuid: scene.uuid, name: scene.name.slice(0, MAX_NAME) };
    if (!multiple) {
      if (picked || (await save([choice]))) setOpen(false);
      return;
    }
    await save(picked ? chosen.filter((other) => other.uuid !== scene.uuid) : [...chosen, choice]);
  };

  const remove = (scene: FoundryScene) =>
    void save(chosen.filter((other) => other.uuid !== scene.uuid));

  let toggleLabel = chosen.length > 0 ? 'Change map' : 'Choose a map from Foundry';
  if (multiple) toggleLabel = open ? 'Done' : 'Add maps from Foundry';
  else if (open) toggleLabel = 'Cancel';

  return (
    <div>
      {chosen.length === 0 && emptyText && <EmptyState>{emptyText}</EmptyState>}
      {chosen.length > 0 && (
        <SceneGallery aria-label={label}>
          {chosen.map((scene) => (
            <Chosen key={scene.uuid}>
              <SceneThumbnail
                name={scene.name}
                url={thumbnails[scene.uuid]}
                label={multiple ? null : 'Foundry scene'}
              />
              <span>
                <LinkButton
                  type="button"
                  aria-label={`Remove ${scene.name}`}
                  disabled={status === 'saving'}
                  onClick={() => remove(scene)}
                >
                  remove
                </LinkButton>
              </span>
            </Chosen>
          ))}
        </SceneGallery>
      )}
      <Controls>
        <HelperButton type="button" aria-expanded={open} onClick={() => setOpen(!open)}>
          {toggleLabel}
        </HelperButton>
        <Meta as="span" aria-live="polite">
          {status === 'saving' && 'Saving…'}
          {status === 'error' && "Couldn't save. Try again."}
        </Meta>
      </Controls>
      {open && (
        <Browser role="group" aria-label={`Choose ${multiple ? 'maps' : 'a map'}: ${label}`}>
          <SceneBrowser
            label={label}
            load={load}
            chosen={chosen}
            multiple={multiple}
            saving={status === 'saving'}
            onPick={(scene) => void pick(scene)}
          />
        </Browser>
      )}
    </div>
  );
};

export default ScenePicker;
