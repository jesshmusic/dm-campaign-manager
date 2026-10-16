import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import ScenePicker, {
  MAX_MAPS,
  NO_SCENES_TEXT,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/components/ScenePicker';
import {
  FoundryScene,
  FoundrySceneSummary,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { foundryScene } from '../fixtures';

const PASS = foundryScene();
const CAVE = foundryScene({
  uuid: 'Scene.aaaaaaaaaaaaaaaa',
  name: 'Cragmaw Cave',
  thumbnailUrl: 'https://example.com/cave.webp',
});
const DOCKS = foundryScene({
  uuid: 'Scene.bbbbbbbbbbbbbbbb',
  name: 'Docks',
  thumbnailUrl: 'https://example.com/docks.webp',
  worldId: 'eberron',
  worldTitle: 'Eberron',
});

type Props = Partial<React.ComponentProps<typeof ScenePicker>>;

const renderPicker = (props: Props = {}, scenes: FoundrySceneSummary[] = [DOCKS, PASS, CAVE]) => {
  const load = jest.fn().mockResolvedValue(scenes);
  const onChange = jest.fn().mockResolvedValue(true);
  const utils = render(
    <ScenePicker
      label="Maps for Stop the cult"
      chosen={[]}
      thumbnails={{}}
      load={load}
      multiple
      onChange={onChange}
      {...props}
    />,
  );
  return { ...utils, load, onChange };
};

const open = (name = 'Add maps from Foundry') =>
  fireEvent.click(screen.getByRole('button', { name }));

const chosenOf = (...scenes: FoundrySceneSummary[]): FoundryScene[] =>
  scenes.map(({ uuid, name }) => ({ uuid, name }));

describe('ScenePicker', () => {
  describe('several maps', () => {
    it('shows the chosen maps with their thumbnails, each removable', async () => {
      const { onChange } = renderPicker({
        chosen: chosenOf(PASS, CAVE),
        thumbnails: { [PASS.uuid]: PASS.thumbnailUrl },
      });

      const gallery = screen.getByRole('list', { name: 'Maps for Stop the cult' });
      expect(within(gallery).getByRole('img', { name: 'Map: Mountain Pass' })).toHaveAttribute(
        'src',
        PASS.thumbnailUrl,
      );
      // No thumbnail yet: just the name
      expect(within(gallery).getByText('Cragmaw Cave')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Remove Mountain Pass' }));

      await waitFor(() => expect(onChange).toHaveBeenCalledWith(chosenOf(CAVE)));
    });

    it('says when there are no maps yet', () => {
      renderPicker({ emptyText: 'No maps yet.' });

      expect(screen.getByText('No maps yet.')).toBeInTheDocument();
      expect(screen.queryByRole('list')).not.toBeInTheDocument();
    });

    it("doesn't load the DM's scenes until opened", async () => {
      const { load } = renderPicker();

      expect(load).not.toHaveBeenCalled();
      open();

      expect(screen.getByText('Loading your Foundry scenes…')).toBeInTheDocument();
      expect(await screen.findByRole('button', { name: 'Mountain Pass' })).toBeInTheDocument();
      expect(load).toHaveBeenCalledTimes(1);
    });

    it('lists the scenes by world, with thumbnails', async () => {
      renderPicker();
      open();

      const greyhawk = await screen.findByRole('region', {
        name: 'Maps for Stop the cult: Greyhawk',
      });
      expect(within(greyhawk).getByRole('heading', { name: 'Greyhawk' })).toBeInTheDocument();
      expect(
        within(greyhawk)
          .getAllByRole('button')
          .map((button) => button.textContent),
      ).toEqual(['Mountain Pass', 'Cragmaw Cave']);
      const eberron = screen.getByRole('region', { name: 'Maps for Stop the cult: Eberron' });
      expect(within(eberron).getByRole('button', { name: 'Docks' })).toBeInTheDocument();
      expect(
        within(eberron).getByRole('button', { name: 'Docks' }).querySelector('img'),
      ).toHaveAttribute('src', DOCKS.thumbnailUrl);
    });

    it('names a world by its id when it has no title', async () => {
      renderPicker({}, [foundryScene({ worldTitle: null })]);
      open();

      expect(await screen.findByRole('heading', { name: 'greyhawk' })).toBeInTheDocument();
    });

    it('adds a scene to the chosen maps, and shows which are chosen', async () => {
      const { onChange } = renderPicker({ chosen: chosenOf(PASS) });
      open();

      expect(await screen.findByRole('button', { name: 'Mountain Pass' })).toHaveAttribute(
        'aria-pressed',
        'true',
      );
      expect(screen.getByRole('button', { name: 'Docks' })).toHaveAttribute(
        'aria-pressed',
        'false',
      );
      fireEvent.click(screen.getByRole('button', { name: 'Docks' }));

      await waitFor(() => expect(onChange).toHaveBeenCalledWith(chosenOf(PASS, DOCKS)));
      // Stays open to pick more
      expect(screen.getByRole('button', { name: 'Done' })).toBeInTheDocument();
    });

    it('takes a chosen scene off when picked again', async () => {
      const { onChange } = renderPicker({ chosen: chosenOf(PASS, CAVE) });
      open();

      fireEvent.click(await screen.findByRole('button', { name: 'Mountain Pass' }));

      await waitFor(() => expect(onChange).toHaveBeenCalledWith(chosenOf(CAVE)));
    });

    it('keeps names to 120 characters', async () => {
      const long = foundryScene({ name: 'x'.repeat(150) });
      const { onChange } = renderPicker({}, [long]);
      open();

      fireEvent.click(await screen.findByRole('button', { name: long.name }));

      await waitFor(() =>
        expect(onChange).toHaveBeenCalledWith([{ uuid: long.uuid, name: 'x'.repeat(120) }]),
      );
    });

    it('searches scenes by name', async () => {
      renderPicker();
      open();

      fireEvent.change(await screen.findByRole('searchbox', { name: 'Search scenes' }), {
        target: { value: 'cave' },
      });

      expect(screen.getByRole('button', { name: 'Cragmaw Cave' })).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Mountain Pass' })).not.toBeInTheDocument();
      expect(screen.queryByRole('heading', { name: 'Eberron' })).not.toBeInTheDocument();

      fireEvent.change(screen.getByRole('searchbox', { name: 'Search scenes' }), {
        target: { value: 'castle' },
      });
      expect(screen.getByText('No scenes match “castle”.')).toBeInTheDocument();
    });

    it('stops adding at the most maps there can be', async () => {
      const chosen = Array.from({ length: MAX_MAPS }, (_, index) => ({
        uuid: `Scene.${String(index).padStart(16, 'c')}`,
        name: `Map ${index}`,
      }));
      renderPicker({ chosen: [...chosen.slice(1), chosenOf(PASS)[0]] });
      open();

      expect(await screen.findByRole('button', { name: 'Docks' })).toBeDisabled();
      expect(screen.getByRole('button', { name: 'Mountain Pass' })).toBeEnabled();
      expect(screen.getByText(/That's the most maps it can have \(20\)/)).toBeInTheDocument();
    });

    it('explains where scenes come from when there are none', async () => {
      renderPicker({}, []);
      open();

      expect(await screen.findByText(NO_SCENES_TEXT)).toBeInTheDocument();
      expect(NO_SCENES_TEXT).toBe(
        "Your Foundry scenes appear here once Dorman Lakely's Campaign Planner is connected with sync. " +
          'It sends a thumbnail of each scene with a map image.',
      );
    });

    it('treats a failed load as no scenes', async () => {
      const load = jest.fn().mockRejectedValue(new Error('offline'));
      render(
        <ScenePicker
          label="Maps"
          chosen={[]}
          thumbnails={{}}
          load={load}
          multiple
          onChange={jest.fn()}
        />,
      );
      open();

      expect(await screen.findByText(NO_SCENES_TEXT)).toBeInTheDocument();
    });

    it("says when a change couldn't be saved", async () => {
      const { onChange } = renderPicker({ chosen: chosenOf(PASS) });
      onChange.mockResolvedValue(false);

      fireEvent.click(screen.getByRole('button', { name: 'Remove Mountain Pass' }));

      expect(await screen.findByText("Couldn't save. Try again.")).toBeInTheDocument();
    });

    it('closes the scene list when done', async () => {
      renderPicker();
      open();
      await screen.findByRole('button', { name: 'Mountain Pass' });

      fireEvent.click(screen.getByRole('button', { name: 'Done' }));

      expect(screen.queryByRole('button', { name: 'Mountain Pass' })).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Add maps from Foundry' })).toHaveAttribute(
        'aria-expanded',
        'false',
      );
    });
  });

  describe('one map', () => {
    it('shows the map with its label, and changes it', async () => {
      const { onChange } = renderPicker({
        multiple: false,
        label: 'Map of Hommlet',
        chosen: chosenOf(PASS),
        thumbnails: { [PASS.uuid]: PASS.thumbnailUrl },
      });

      expect(screen.getByText('Foundry scene: Mountain Pass')).toBeInTheDocument();
      open('Change map');
      fireEvent.click(await screen.findByRole('button', { name: 'Cragmaw Cave' }));

      await waitFor(() => expect(onChange).toHaveBeenCalledWith(chosenOf(CAVE)));
      // Closes once picked
      await waitFor(() =>
        expect(screen.queryByRole('button', { name: 'Cragmaw Cave' })).not.toBeInTheDocument(),
      );
    });

    it('chooses a first map, or cancels', async () => {
      const { onChange } = renderPicker({ multiple: false, label: 'Map of Hommlet' });

      open('Choose a map from Foundry');
      await screen.findByRole('button', { name: 'Docks' });
      fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
      expect(screen.queryByRole('button', { name: 'Docks' })).not.toBeInTheDocument();

      open('Choose a map from Foundry');
      fireEvent.click(await screen.findByRole('button', { name: 'Docks' }));
      await waitFor(() => expect(onChange).toHaveBeenCalledWith(chosenOf(DOCKS)));
    });

    it('closes without saving when the current map is picked again', async () => {
      const { onChange } = renderPicker({ multiple: false, chosen: chosenOf(PASS) });

      open('Change map');
      fireEvent.click(await screen.findByRole('button', { name: 'Mountain Pass' }));

      expect(screen.queryByRole('button', { name: 'Cragmaw Cave' })).not.toBeInTheDocument();
      expect(onChange).not.toHaveBeenCalled();
    });

    it('stays open when the change fails', async () => {
      const { onChange } = renderPicker({ multiple: false });
      onChange.mockResolvedValue(false);

      open('Choose a map from Foundry');
      fireEvent.click(await screen.findByRole('button', { name: 'Docks' }));

      expect(await screen.findByText("Couldn't save. Try again.")).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Docks' })).toBeInTheDocument();
    });

    it('removes the map', async () => {
      const { onChange } = renderPicker({ multiple: false, chosen: chosenOf(PASS) });

      fireEvent.click(screen.getByRole('button', { name: 'Remove Mountain Pass' }));

      await waitFor(() => expect(onChange).toHaveBeenCalledWith([]));
    });
  });
});
