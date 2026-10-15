import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../test-utils';
import NewCampaign, {
  TEMPLATES,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/NewCampaign';
import { jsonResponse, sampleCampaign, samplePacks } from './fixtures';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer',
  () =>
    function MockPageContainer({ children }: { children: React.ReactNode }) {
      return <div data-testid="page-container">{children}</div>;
    },
);

jest.mock(
  '../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle',
  () =>
    function MockPageTitle({ title }: { title: string }) {
      return <h1>{title}</h1>;
    },
);

const renderPage = () =>
  render(
    <MemoryRouter initialEntries={['/app/campaigns/new']}>
      <Routes>
        <Route path="/app/campaigns/new" element={<NewCampaign />} />
        <Route path="/app/campaigns/:campaignSlug" element={<p>Campaign page</p>} />
        <Route path="/app/campaigns" element={<p>All campaigns page</p>} />
      </Routes>
    </MemoryRouter>,
  );

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;

describe('NewCampaign', () => {
  let mockFetch: jest.Mock;

  const createRequest = () =>
    mockFetch.mock.calls.find(
      ([url, init]: [string, RequestInit]) => url === '/v1/campaigns' && init.method === 'POST',
    );

  beforeEach(() => {
    mockFetch = jest.fn((url: string) =>
      url === '/v1/compendium/packs'
        ? jsonResponse(samplePacks())
        : jsonResponse(sampleCampaign(), 201),
    );
    global.fetch = mockFetch;
  });

  it('offers a template for each kind of campaign', () => {
    expect(TEMPLATES.map((template) => [template.value, template.mode])).toEqual([
      ['three_act', 'arc'],
      ['sandbox', 'sandbox'],
      ['five_room', 'oneshot'],
      ['blank', 'arc'],
    ]);

    renderPage();

    expect(screen.getByRole('radiogroup', { name: 'Campaign template' })).toBeInTheDocument();
    expect(screen.getAllByRole('radio')).toHaveLength(4);
    expect(screen.getByRole('radio', { name: /^Story arc/ })).toBeChecked();
  });

  it('starts the brief with a typical party', () => {
    renderPage();

    expect(input('party_size')).toHaveValue(4);
    expect(input('start_level')).toHaveValue(1);
    // Blank, so story arcs use the server's default of 6 and other templates send nothing
    expect(input('planned_sessions')).toHaveValue(null);
    expect(screen.getByRole('link', { name: '← All campaigns' })).toHaveAttribute(
      'href',
      '/app/campaigns',
    );
  });

  it('creates a story arc campaign and opens it', async () => {
    renderPage();

    fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
    fireEvent.change(input('setting_name'), { target: { value: 'Greyhawk' } });
    fireEvent.change(input('truths'), {
      target: { value: 'The dead walk\nThe temple is corrupt' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

    expect(await screen.findByText('Campaign page')).toBeInTheDocument();
    expect(JSON.parse(createRequest()[1].body)).toEqual({
      campaign: {
        name: 'Zombie Siege',
        setting_name: 'Greyhawk',
        tone: null,
        party_size: 4,
        start_level: 1,
        target_level: null,
        planned_sessions: null,
        cadence: null,
        premise: null,
        pitch: null,
        truths: ['The dead walk', 'The temple is corrupt'],
        setting_notes: null,
        mode: 'arc',
        excluded_compendium_packs: [],
      },
      template: 'three_act',
    });
  });

  it('lists the Foundry compendiums in a sidebar, all on to start', async () => {
    renderPage();

    const sidebar = screen.getByRole('complementary', { name: 'Compendiums' });
    expect(await within(sidebar).findByRole('checkbox', { name: 'All compendiums' })).toBeChecked();
    const monsterManual = within(sidebar).getByRole('group', { name: 'Monster Manual' });
    expect(within(monsterManual).getByRole('checkbox', { name: /Monsters/ })).toBeChecked();
    expect(within(monsterManual).getByRole('checkbox', { name: /Tables/ })).toBeChecked();
    expect(
      within(within(sidebar).getByRole('group', { name: 'SRD 5.2' })).getByRole('checkbox', {
        name: /Monsters/,
      }),
    ).toBeChecked();
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/compendium/packs',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('creates the campaign without the compendiums the DM turned off', async () => {
    renderPage();

    const monsterManual = await screen.findByRole('group', { name: 'Monster Manual' });
    fireEvent.click(within(monsterManual).getByRole('checkbox', { name: /Monsters/ }));
    fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

    expect(await screen.findByText('Campaign page')).toBeInTheDocument();
    expect(JSON.parse(createRequest()[1].body).campaign.excluded_compendium_packs).toEqual([
      'dnd-monster-manual.actors',
    ]);
  });

  it('turns every compendium off and back on with one checkbox', async () => {
    renderPage();

    const all = await screen.findByRole('checkbox', { name: 'All compendiums' });
    fireEvent.click(all);

    expect(all).not.toBeChecked();
    expect(
      screen.getAllByRole('checkbox').filter((box) => (box as HTMLInputElement).checked),
    ).toEqual([]);

    fireEvent.click(all);
    expect(screen.getAllByRole('checkbox').every((box) => (box as HTMLInputElement).checked)).toBe(
      true,
    );
  });

  it('explains where compendiums come from when there are none', async () => {
    mockFetch.mockImplementation((url: string) =>
      url === '/v1/compendium/packs' ? jsonResponse([]) : jsonResponse(sampleCampaign(), 201),
    );
    renderPage();

    expect(await screen.findByText(/No compendiums yet/)).toBeInTheDocument();
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it.each([
    ['Sandbox', 'sandbox', 'sandbox'],
    ['One-shot', 'five_room', 'oneshot'],
    ['Blank', 'blank', 'arc'],
  ])('sets the template and mode from the %s choice', async (title, template, mode) => {
    renderPage();

    const radio = screen.getByRole('radio', { name: new RegExp(`^${title}`) });
    fireEvent.click(radio);
    expect(radio).toBeChecked();
    expect(screen.getByRole('radio', { name: /^Story arc/ })).not.toBeChecked();
    fireEvent.change(input('name'), { target: { value: 'Quick game' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

    expect(await screen.findByText('Campaign page')).toBeInTheDocument();
    const body = JSON.parse(createRequest()[1].body);
    expect(body.template).toBe(template);
    expect(body.campaign.mode).toBe(mode);
  });

  it('shows the server error and stays on the form', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ errors: ["Name can't be blank"] }, 422));
    renderPage();

    fireEvent.change(input('name'), { target: { value: ' ' } });
    fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

    expect(await screen.findByText("Name can't be blank")).toBeInTheDocument();
    expect(screen.queryByText('Campaign page')).not.toBeInTheDocument();
    await waitFor(() =>
      expect(screen.getByRole('button', { name: 'Create campaign' })).toBeEnabled(),
    );
  });

  it('suggests a premise for the party and setting', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ adventure_hook: 'Zombies rise in Hommlet' }));
    renderPage();

    fireEvent.change(input('setting_name'), { target: { value: 'Greyhawk' } });
    fireEvent.change(input('start_level'), { target: { value: '3' } });
    fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

    await waitFor(() => expect(input('premise')).toHaveValue('Zombies rise in Hommlet'));
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/adventure_hook.json?player_count=4&average_level=3&setting=Greyhawk',
      expect.objectContaining({ method: 'GET' }),
    );
  });

  it('suggests a premise with default party details when they are blank', async () => {
    mockFetch.mockImplementation(() => jsonResponse({ adventure_hook: 'Goblins!' }));
    renderPage();

    fireEvent.change(input('party_size'), { target: { value: '' } });
    fireEvent.change(input('start_level'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

    await waitFor(() => expect(input('premise')).toHaveValue('Goblins!'));
    expect(mockFetch).toHaveBeenCalledWith(
      '/v1/adventure_hook.json?player_count=4&average_level=1&setting=',
      expect.objectContaining({ method: 'GET' }),
    );
  });
});
