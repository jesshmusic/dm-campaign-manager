import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../test-utils';
import NewCampaign from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/NewCampaign';
import {
  SETUP_STEPS,
  TEMPLATES,
} from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/setup/setupSteps';
import { DRAFT_KEY } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/setup/useSetupDraft';
import { jsonResponse, playerCharacter, sampleCampaign, samplePacks } from './fixtures';

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

// The DM's characters as /v1/player-characters lists them, without sheets
const sampleCharacters = () =>
  [playerCharacter(), playerCharacter({ id: 'pc2', name: 'Borin', classes: 'Fighter' })].map(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ({ sheet, ...summary }) => summary,
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
const heading = () => screen.getByRole('heading', { level: 2 });
const next = () => fireEvent.click(screen.getByRole('button', { name: /^Next: / }));
const back = () => fireEvent.click(screen.getByRole('button', { name: 'Back' }));
const stepButton = (label: string) =>
  within(screen.getByRole('navigation', { name: 'Setup steps' })).getByRole('button', {
    name: new RegExp(`\\. ${label}$`),
  });

// From the first step to the review, naming the campaign on the way
const goToReview = async (name = 'Zombie Siege') => {
  next();
  fireEvent.change(input('name'), { target: { value: name } });
  next();
  await screen.findByRole('checkbox', { name: 'Akra is in the party' });
  next();
  next();
  await screen.findByRole('checkbox', { name: 'All compendiums' });
  next();
  expect(heading()).toHaveTextContent('Review and create');
};

describe('NewCampaign', () => {
  let mockFetch: jest.Mock;

  const createRequest = () =>
    mockFetch.mock.calls.find(
      ([url, init]: [string, RequestInit]) => url === '/v1/campaigns' && init.method === 'POST',
    );
  const createdCampaign = () => JSON.parse(createRequest()[1].body);

  beforeEach(() => {
    window.localStorage.clear();
    mockFetch = jest.fn((url: string) => {
      if (url === '/v1/compendium/packs') return jsonResponse(samplePacks());
      if (url === '/v1/player-characters') return jsonResponse(sampleCharacters());
      return jsonResponse(sampleCampaign(), 201);
    });
    global.fetch = mockFetch;
  });

  describe('the steps', () => {
    it('starts with what kind of game, showing every step to come', () => {
      renderPage();

      expect(heading()).toHaveTextContent('What kind of game?');
      expect(
        within(screen.getByRole('navigation', { name: 'Setup steps' }))
          .getAllByRole('button')
          .map((button) => button.textContent),
      ).toEqual(['1. Kind', '2. Pitch', '3. Table', '4. World', '5. Books', '6. Review']);
      expect(stepButton('Kind')).toHaveAttribute('aria-current', 'step');
      expect(stepButton('Pitch')).toBeDisabled();
      expect(screen.getByRole('link', { name: '← All campaigns' })).toHaveAttribute(
        'href',
        '/app/campaigns',
      );
    });

    it('explains why each step matters, with an example', () => {
      renderPage();
      next();

      const why = screen.getByRole('complementary', { name: 'Why this matters' });
      expect(within(why).getByText(/a situation, not a plot/)).toBeInTheDocument();
      expect(within(why).getByText(/The dead are rising in Hommlet/)).toBeInTheDocument();
    });

    it('has words for every step', () => {
      expect(SETUP_STEPS.map((step) => step.id)).toEqual([
        'kind',
        'pitch',
        'table',
        'world',
        'books',
        'review',
      ]);
      SETUP_STEPS.forEach((step) => {
        expect(step.title).toBeTruthy();
        expect(step.intro).toBeTruthy();
      });
    });

    it('offers a template for each kind of campaign, with an example', () => {
      expect(TEMPLATES.map((template) => [template.value, template.mode])).toEqual([
        ['three_act', 'arc'],
        ['sandbox', 'sandbox'],
        ['five_room', 'oneshot'],
        ['blank', 'arc'],
      ]);

      renderPage();

      expect(screen.getAllByRole('radio')).toHaveLength(4);
      expect(screen.getByRole('radio', { name: /^Story arc/ })).toBeChecked();
      expect(
        screen.getByText('Six weekly sessions to stop a zombie plague in Greyhawk.'),
      ).toBeInTheDocument();
    });

    it('needs a name before leaving the pitch', () => {
      renderPage();
      next();

      next();
      expect(screen.getByText('Give your campaign a name to go on.')).toBeInTheDocument();
      expect(heading()).toHaveTextContent('The pitch');

      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();
      expect(heading()).toHaveTextContent('The table');
    });

    it('asks for six truths at most', () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();
      next();
      fireEvent.change(input('truths'), {
        target: { value: ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'].join('\n') },
      });

      next();
      expect(screen.getByText('Keep it to 6 truths. You have 7.')).toBeInTheDocument();
      expect(heading()).toHaveTextContent('The world');

      fireEvent.change(input('truths'), { target: { value: 'One\n\nTwo' } });
      next();
      expect(heading()).toHaveTextContent('Your books');
    });

    it('keeps answers when going back and forward', () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      fireEvent.change(input('tone'), { target: { value: 'grim' } });
      next();
      back();

      expect(input('name')).toHaveValue('Zombie Siege');
      expect(input('tone')).toHaveValue('grim');
    });

    it('jumps back to a step it has reached from the progress list', () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();

      fireEvent.click(stepButton('Kind'));
      expect(heading()).toHaveTextContent('What kind of game?');
      fireEvent.click(stepButton('Table'));
      expect(heading()).toHaveTextContent('The table');
      expect(stepButton('World')).toBeDisabled();
    });

    it('moves focus to each new step', () => {
      renderPage();
      expect(heading()).not.toHaveFocus();

      next();
      expect(heading()).toHaveFocus();
    });
  });

  describe('the table', () => {
    it("lists the DM's characters to choose the party from", async () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();

      const table = await screen.findByRole('table', { name: 'Greyhawk' });
      expect(within(table).getByRole('row', { name: /Akra/ })).toHaveTextContent(
        'AkraCleric (Life Domain)5Sam',
      );
      expect(input('party_size')).toHaveValue(4);
      expect(input('start_level')).toHaveValue(1);
    });

    it('counts the players from the party until the DM types a number', async () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();

      fireEvent.click(await screen.findByRole('checkbox', { name: 'Akra is in the party' }));
      expect(input('party_size')).toHaveValue(1);
      fireEvent.click(screen.getByRole('checkbox', { name: 'Borin is in the party' }));
      expect(input('party_size')).toHaveValue(2);

      fireEvent.change(input('party_size'), { target: { value: '5' } });
      fireEvent.click(screen.getByRole('checkbox', { name: 'Borin is in the party' }));
      expect(input('party_size')).toHaveValue(5);
    });
  });

  describe('your books', () => {
    it('lists the Foundry compendiums, all on to start', async () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();
      next();
      next();

      expect(heading()).toHaveTextContent('Your books');
      expect(await screen.findByRole('checkbox', { name: 'All compendiums' })).toBeChecked();
      expect(
        within(screen.getByRole('group', { name: 'Monster Manual' })).getByRole('checkbox', {
          name: /Monsters/,
        }),
      ).toBeChecked();
    });

    it('explains where compendiums come from when there are none', async () => {
      mockFetch.mockImplementation((url: string) =>
        url === '/v1/compendium/packs' || url === '/v1/player-characters'
          ? jsonResponse([])
          : jsonResponse(sampleCampaign(), 201),
      );
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();
      next();
      next();

      expect(await screen.findByText(/No compendiums yet/)).toBeInTheDocument();
    });
  });

  describe('review and create', () => {
    it('creates a story arc campaign from every answer', async () => {
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      fireEvent.change(input('tone'), { target: { value: 'survival horror' } });
      fireEvent.change(input('premise'), { target: { value: 'The dead rise' } });
      fireEvent.change(input('pitch'), { target: { value: 'Hold the walls' } });
      next();
      fireEvent.click(await screen.findByRole('checkbox', { name: 'Akra is in the party' }));
      fireEvent.change(input('start_level'), { target: { value: '3' } });
      fireEvent.change(input('target_level'), { target: { value: '8' } });
      fireEvent.change(input('planned_sessions'), { target: { value: '6' } });
      fireEvent.change(input('cadence'), { target: { value: 'weekly' } });
      next();
      fireEvent.change(input('setting_name'), { target: { value: 'Greyhawk' } });
      fireEvent.change(input('truths'), {
        target: { value: 'The dead walk\nThe temple is corrupt' },
      });
      next();
      fireEvent.click(
        within(await screen.findByRole('group', { name: 'Monster Manual' })).getByRole('checkbox', {
          name: /Monsters/,
        }),
      );
      next();

      const review = screen.getByRole('heading', { level: 2 }).parentElement as HTMLElement;
      expect(within(review).getByText('Story arc')).toBeInTheDocument();
      expect(within(review).getByText('Akra')).toBeInTheDocument();
      expect(within(review).getByText('3 to 8')).toBeInTheDocument();
      expect(within(review).getByRole('list', { name: 'Truths of the setting' })).toHaveTextContent(
        'The dead walkThe temple is corrupt',
      );
      expect(within(review).getByText('2 of 3 compendiums')).toBeInTheDocument();

      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      expect(await screen.findByText('Campaign page')).toBeInTheDocument();
      expect(createdCampaign()).toEqual({
        campaign: {
          name: 'Zombie Siege',
          setting_name: 'Greyhawk',
          tone: 'survival horror',
          party_size: 1,
          start_level: 3,
          target_level: 8,
          planned_sessions: 6,
          cadence: 'weekly',
          premise: 'The dead rise',
          pitch: 'Hold the walls',
          truths: ['The dead walk', 'The temple is corrupt'],
          setting_notes: null,
          mode: 'arc',
          excluded_compendium_packs: ['dnd-monster-manual.actors'],
          party_character_ids: ['pc1'],
        },
        template: 'three_act',
      });
    });

    it.each([
      ['Sandbox', 'sandbox', 'sandbox'],
      ['One-shot', 'five_room', 'oneshot'],
      ['Blank', 'blank', 'arc'],
    ])('sets the template and mode from the %s choice', async (title, template, mode) => {
      renderPage();
      fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${title}`) }));
      await goToReview();

      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      await screen.findByText('Campaign page');
      expect(createdCampaign().template).toBe(template);
      expect(createdCampaign().campaign.mode).toBe(mode);
    });

    it('goes back to a step from its Edit link', async () => {
      renderPage();
      await goToReview();

      fireEvent.click(screen.getByRole('button', { name: 'Edit the world' }));

      expect(heading()).toHaveTextContent('The world');
    });

    it('says what is still empty', async () => {
      renderPage();
      await goToReview();

      expect(screen.getByText('Nothing yet. You can add it later.')).toBeInTheDocument();
      expect(screen.getByText('All compendiums')).toBeInTheDocument();
    });

    it('shows the server error and stays on the review', async () => {
      renderPage();
      await goToReview();
      mockFetch.mockImplementation(() => jsonResponse({ errors: ['Name is taken'] }, 422));

      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      expect(await screen.findByText('Name is taken')).toBeInTheDocument();
      expect(heading()).toHaveTextContent('Review and create');
      await waitFor(() =>
        expect(screen.getByRole('button', { name: 'Create campaign' })).toBeEnabled(),
      );
    });

    it('opens the new campaign once it is created', async () => {
      renderPage();
      await goToReview();
      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      expect(await screen.findByText('Campaign page')).toBeInTheDocument();
    });
  });

  describe('the draft', () => {
    it('picks up where the DM left off', () => {
      const first = renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      first.unmount();

      renderPage();

      expect(screen.getByText('Picking up where you left off.')).toBeInTheDocument();
      expect(heading()).toHaveTextContent('The pitch');
      expect(input('name')).toHaveValue('Zombie Siege');
    });

    it('starts over', () => {
      const first = renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      first.unmount();
      renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

      expect(heading()).toHaveTextContent('What kind of game?');
      expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
      expect(screen.queryByText('Picking up where you left off.')).not.toBeInTheDocument();
    });

    it('saves nothing until the DM changes something', () => {
      renderPage();

      expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('forgets the draft once the campaign is created', async () => {
      renderPage();
      await goToReview();
      expect(window.localStorage.getItem(DRAFT_KEY)).not.toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      await screen.findByText('Campaign page');
      expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('ignores a draft it cannot read', () => {
      window.localStorage.setItem(DRAFT_KEY, '{not json');

      renderPage();

      expect(heading()).toHaveTextContent('What kind of game?');
      expect(screen.queryByText('Picking up where you left off.')).not.toBeInTheDocument();
    });

    it('keeps a restored step within the guide', () => {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step: 99, furthest: 99, values: { name: 'Old' } }),
      );

      renderPage();

      expect(heading()).toHaveTextContent('Review and create');
    });

    it('works when the browser will not store anything', () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });

      expect(input('name')).toHaveValue('Zombie Siege');
      setItem.mockRestore();
    });
  });

  describe('suggesting a premise', () => {
    it('uses the party and setting so far', async () => {
      mockFetch.mockImplementation(() =>
        jsonResponse({ adventure_hook: 'Zombies rise in Hommlet' }),
      );
      renderPage();
      next();

      fireEvent.click(screen.getByRole('button', { name: 'Suggest a hook' }));

      await waitFor(() => expect(input('premise')).toHaveValue('Zombies rise in Hommlet'));
      expect(mockFetch).toHaveBeenCalledWith(
        '/v1/adventure_hook.json?player_count=4&average_level=1&setting=',
        expect.objectContaining({ method: 'GET' }),
      );
    });
  });
});
