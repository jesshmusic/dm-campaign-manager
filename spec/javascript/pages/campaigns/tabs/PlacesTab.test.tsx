import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import PlacesTab from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/PlacesTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, sampleCampaign } from '../fixtures';

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

  it('shows the Foundry scene linked in Foundry', () => {
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

  it('says scenes are linked in Foundry, and has no field for them', () => {
    renderTab();

    expect(
      screen.getByText(
        /Link a place to a Foundry scene in Foundry, with Dorman Lakely's Campaign Planner/,
      ),
    ).toBeInTheDocument();
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
    fireEvent.change(input('parent_id'), { target: { value: 'l1' } });
    fireEvent.change(input('features'), { target: { value: 'Roaring hearth\nSecret cellar' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Add location' })[0]);

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
    expect(input('parent_id')).toHaveValue('l1');
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

    const options = Array.from(input('parent_id').querySelectorAll('option')).map(
      (o) => o.textContent,
    );
    expect(options).toEqual(['Nowhere (top level)', 'Moathouse']);
  });

  it('deletes a location', () => {
    const { state } = renderTab();

    fireEvent.click(within(cardFor('Hommlet')).getByRole('button', { name: 'Delete' }));

    expect(state.removeChild).toHaveBeenCalledWith('locations', 'l1');
  });
});
