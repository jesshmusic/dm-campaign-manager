import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PlacesTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/PlacesTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, foundryScene, makeApi, makeState, sampleCampaign } from '../fixtures';
import { chooseOption, menuOptions, openSelect } from '../selectHelpers';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(<PlacesTab campaign={campaign} state={state} />);
  return { campaign, state };
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
const cardFor = (name: string) =>
  screen.getByRole('heading', { name }).parentElement as HTMLElement;

describe('PlacesTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('lists locations with their description and fantastic features', () => {
    renderTab();

    const hommlet = cardFor('Hommlet');
    expect(within(hommlet).getByText('A quiet village')).toBeInTheDocument();
    expect(within(hommlet).getByText('Inn of the Welcome Wench')).toBeInTheDocument();
    expect(within(hommlet).getByText('Druid grove')).toBeInTheDocument();
    expect(within(hommlet).queryByRole('list')).toBeInTheDocument();
    expect(within(cardFor('Moathouse')).queryByRole('list')).not.toBeInTheDocument();
  });

  it('shows which location a place is inside', () => {
    renderTab();

    expect(within(cardFor('Moathouse')).getByText('In Hommlet')).toBeInTheDocument();
    expect(within(cardFor('Hommlet')).queryByText(/^In /)).not.toBeInTheDocument();
  });

  it("shows each place's map", () => {
    const campaign = sampleCampaign();
    campaign.locations[0] = {
      ...campaign.locations[0],
      foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx',
      foundrySceneName: 'Mountain Pass',
    };
    renderTab(campaign);

    expect(
      within(cardFor('Hommlet')).getByText('Foundry scene: Mountain Pass'),
    ).toBeInTheDocument();
    expect(within(cardFor('Moathouse')).queryByText(/Foundry scene/)).not.toBeInTheDocument();
  });

  it("shows the scene's thumbnail once Foundry has sent it", () => {
    const campaign = sampleCampaign();
    campaign.locations[0] = {
      ...campaign.locations[0],
      foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx',
      foundrySceneName: 'Mountain Pass',
    };
    campaign.sceneThumbnails = { 'Scene.5wVcsNPOg2RjRbFx': 'https://example.com/pass.webp' };
    renderTab(campaign);

    expect(
      within(cardFor('Hommlet')).getByRole('img', { name: 'Map: Mountain Pass' }),
    ).toHaveAttribute('src', 'https://example.com/pass.webp');
    expect(
      within(cardFor('Hommlet')).getByText('Foundry scene: Mountain Pass'),
    ).toBeInTheDocument();
  });

  it("shows a linked scene's UUID when it has no name", () => {
    const campaign = sampleCampaign();
    campaign.locations[0] = {
      ...campaign.locations[0],
      foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx',
    };
    renderTab(campaign);

    expect(
      within(cardFor('Hommlet')).getByText('Foundry scene: Scene.5wVcsNPOg2RjRbFx'),
    ).toBeInTheDocument();
  });

  it('says maps come from Foundry scenes, picked here or in Foundry', () => {
    renderTab();

    expect(
      screen.getByText(
        /Give a place a map from your Foundry scenes, here or in Foundry with Dorman Lakely's Campaign Planner/,
      ),
    ).toBeInTheDocument();
  });

  it("picks a place's map from the DM's Foundry scenes", async () => {
    const cave = foundryScene({ uuid: 'Scene.aaaaaaaaaaaaaaaa', name: 'Cragmaw Cave' });
    const state = makeState({
      api: makeApi({ listFoundryScenes: jest.fn().mockResolvedValue([foundryScene(), cave]) }),
    });
    renderTab(sampleCampaign(), state);

    const moathouse = cardFor('Moathouse');
    fireEvent.click(within(moathouse).getByRole('button', { name: 'Choose a map from Foundry' }));
    fireEvent.click(await within(moathouse).findByRole('button', { name: 'Cragmaw Cave' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'locations',
        { foundry_scene_uuid: 'Scene.aaaaaaaaaaaaaaaa', foundry_scene_name: 'Cragmaw Cave' },
        'l2',
      ),
    );
    expect(state.api.listFoundryScenes).toHaveBeenCalledTimes(1);
  });

  it("removes a place's map", async () => {
    const campaign = sampleCampaign();
    campaign.locations[0] = {
      ...campaign.locations[0],
      foundrySceneUuid: 'Scene.5wVcsNPOg2RjRbFx',
      foundrySceneName: 'Mountain Pass',
    };
    const { state } = renderTab(campaign);

    expect(
      within(cardFor('Hommlet')).getByRole('button', { name: 'Change map' }),
    ).toBeInTheDocument();
    fireEvent.click(
      within(cardFor('Hommlet')).getByRole('button', { name: 'Remove Mountain Pass' }),
    );

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'locations',
        { foundry_scene_uuid: null, foundry_scene_name: null },
        'l1',
      ),
    );
  });

  it("shows a place's roll tables, added in Foundry", () => {
    const campaign = sampleCampaign();
    campaign.locations[0] = {
      ...campaign.locations[0],
      rollTables: [
        { uuid: 'RollTable.5wVcsNPOg2RjRbFx', name: 'Village encounters' },
        { uuid: 'Compendium.dnd5e.tables24.RollTable.abcdefghijklmnop', name: 'Trinkets' },
      ],
    };
    renderTab(campaign);

    const tables = within(cardFor('Hommlet')).getByRole('group', {
      name: 'Random encounters at Hommlet',
    });
    expect(
      within(tables)
        .getAllByRole('listitem')
        .map((item) => item.textContent),
    ).toEqual(['Village encounters remove', 'Trinkets (compendium) remove']);
    expect(
      within(tables).getByText('Add roll tables in Foundry: drag a roll table onto the place.'),
    ).toBeInTheDocument();
    expect(within(cardFor('Moathouse')).getByText('No roll tables yet.')).toBeInTheDocument();
  });

  it('removes a roll table', async () => {
    const campaign = sampleCampaign();
    const tables = [
      { uuid: 'RollTable.5wVcsNPOg2RjRbFx', name: 'Village encounters' },
      { uuid: 'RollTable.abcdefghijklmnop', name: 'Weather' },
    ];
    campaign.locations[0] = { ...campaign.locations[0], rollTables: tables };
    const { state } = renderTab(campaign);

    fireEvent.click(
      within(cardFor('Hommlet')).getByRole('button', { name: 'Remove Village encounters' }),
    );

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith('locations', { roll_tables: [tables[1]] }, 'l1'),
    );
  });

  it('has no map field in the place form', () => {
    renderTab();

    fireEvent.click(within(cardFor('Hommlet')).getByRole('button', { name: 'Edit' }));
    expect(screen.queryByLabelText(/scene/i)).not.toBeInTheDocument();
  });

  it('shows the empty text with no locations', () => {
    renderTab(sampleCampaign({ locations: [] }));

    expect(screen.getByText(/No locations yet/)).toBeInTheDocument();
  });

  it('adds a location named by the tavern name generator', async () => {
    const { state } = renderTab();

    fireEvent.click(screen.getByRole('button', { name: 'Add location' }));
    fireEvent.click(screen.getByRole('button', { name: 'Tavern name' }));
    await waitFor(() => expect(input('name')).toHaveValue('The Prancing Pony'));
    await chooseOption('Inside', 'Hommlet');
    const dialog = within(screen.getByRole('dialog'));
    fireEvent.click(dialog.getByRole('button', { name: 'Add a feature' }));
    fireEvent.change(dialog.getByRole('textbox', { name: 'Feature 1' }), {
      target: { value: 'Roaring hearth' },
    });
    fireEvent.click(dialog.getByRole('button', { name: 'Add a feature' }));
    fireEvent.change(dialog.getByRole('textbox', { name: 'Feature 2' }), {
      target: { value: 'Secret cellar' },
    });
    fireEvent.click(
      within(screen.getByRole('dialog')).getByRole('button', { name: 'Add location' }),
    );

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'locations',
        {
          name: 'The Prancing Pony',
          parent_id: 'l1',
          description: null,
          features: ['Roaring hearth', 'Secret cellar'],
          notes: null,
        },
        undefined,
      ),
    );
    expect(state.api.randomTavernName).toHaveBeenCalledWith('Greyhawk');
  });

  it('edits a location with its current values', async () => {
    const { state } = renderTab();

    fireEvent.click(within(cardFor('Moathouse')).getByRole('button', { name: 'Edit' }));
    expect(within(screen.getByRole('dialog')).getByText('Hommlet')).toBeInTheDocument();
    fireEvent.change(input('description'), { target: { value: 'Ruined and haunted' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'locations',
        expect.objectContaining({
          name: 'Moathouse',
          parent_id: 'l1',
          description: 'Ruined and haunted',
        }),
        'l2',
      ),
    );
  });

  it("doesn't offer a location as its own parent when editing it", () => {
    renderTab();

    fireEvent.click(within(cardFor('Hommlet')).getByRole('button', { name: 'Edit' }));

    openSelect('Inside');
    expect(menuOptions()).toEqual(['Moathouse']);
  });

  it('deletes a location', () => {
    const { state } = renderTab();

    fireEvent.click(within(cardFor('Hommlet')).getByRole('button', { name: 'Delete' }));

    expect(state.removeChild).toHaveBeenCalledWith('locations', 'l1');
  });
});
