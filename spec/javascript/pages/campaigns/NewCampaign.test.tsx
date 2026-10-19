import React from 'react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../test-utils';
import NewCampaign from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/NewCampaign';
import { DRAFT_KEY } from '../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/setup/useSetupDraft';
import { jsonResponse, playerCharacter, sampleCampaign, samplePacks, setupGuide } from './fixtures';

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

const mountPage = () =>
  render(
    <MemoryRouter initialEntries={['/app/campaigns/new']}>
      <Routes>
        <Route path="/app/campaigns/new" element={<NewCampaign />} />
        <Route path="/app/campaigns/:campaignSlug" element={<p>Campaign page</p>} />
        <Route path="/app/campaigns" element={<p>All campaigns page</p>} />
      </Routes>
    </MemoryRouter>,
  );

// Opens the page and waits for the guide's words to arrive
const renderPage = async () => {
  const page = mountPage();
  await screen.findByRole('navigation', { name: 'Setup steps' });
  return page;
};

const GUIDE_URL = '/v1/setup_guide';

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
  const guideRequests = () => mockFetch.mock.calls.filter(([url]) => url === GUIDE_URL);

  // Answers the guide's words, then hands every other request to `respond`
  const withGuide =
    (respond: (url: string) => Promise<Response>, guide = setupGuide()) =>
    (url: string) =>
      url === GUIDE_URL ? jsonResponse(guide) : respond(url);

  beforeEach(() => {
    window.localStorage.clear();
    mockFetch = jest.fn(
      withGuide((url: string) => {
        if (url === '/v1/compendium/packs') return jsonResponse(samplePacks());
        if (url === '/v1/player-characters') return jsonResponse(sampleCharacters());
        return jsonResponse(sampleCampaign(), 201);
      }),
    );
    global.fetch = mockFetch;
  });

  describe("the guide's words", () => {
    it('shows a loading message until they arrive', async () => {
      let answer: (response: Response) => void = () => undefined;
      mockFetch.mockImplementation((url: string) =>
        url === GUIDE_URL
          ? new Promise<Response>((resolve) => {
              answer = resolve;
            })
          : jsonResponse([]),
      );
      mountPage();

      expect(screen.getByText('Loading the guide…')).toBeInTheDocument();
      expect(screen.queryByRole('navigation', { name: 'Setup steps' })).not.toBeInTheDocument();

      await waitFor(() => expect(guideRequests()).toHaveLength(1));
      answer(await jsonResponse(setupGuide()));
      expect(await screen.findByRole('heading', { level: 2 })).toHaveTextContent(
        'What kind of game?',
      );
      expect(screen.queryByText('Loading the guide…')).not.toBeInTheDocument();
    });

    it('come from the server', async () => {
      const guide = setupGuide();
      guide.steps[0] = { ...guide.steps[0], title: 'Pick a shape', intro: 'Arc or sandbox?' };
      guide.templates[1] = { ...guide.templates[1], title: 'Open world', example: '' };
      mockFetch.mockImplementation(withGuide(() => jsonResponse([]), guide));

      await renderPage();

      expect(heading()).toHaveTextContent('Pick a shape');
      expect(screen.getByText('Arc or sandbox?')).toBeInTheDocument();
      expect(screen.getByRole('radio', { name: /^Open world/ })).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Next: The pitch' })).toBeInTheDocument();
      expect(guideRequests()).toHaveLength(1);
    });

    it('offers to try again when they do not load', async () => {
      mockFetch.mockImplementation((url: string) =>
        url === GUIDE_URL ? jsonResponse({ errors: ['Down'] }, 500) : jsonResponse([]),
      );
      mountPage();

      expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the setup guide.');
      expect(screen.queryByRole('navigation', { name: 'Setup steps' })).not.toBeInTheDocument();

      mockFetch.mockImplementation(withGuide(() => jsonResponse([])));
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

      expect(await screen.findByRole('navigation', { name: 'Setup steps' })).toBeInTheDocument();
      expect(heading()).toHaveTextContent('What kind of game?');
      expect(guideRequests()).toHaveLength(2);
    });

    it('says so when a step is missing', async () => {
      const guide = setupGuide();
      guide.steps = guide.steps.filter((step) => step.id !== 'review');
      mockFetch.mockImplementation(withGuide(() => jsonResponse([]), guide));
      mountPage();

      expect(await screen.findByRole('alert')).toHaveTextContent(
        'The setup guide is missing some of its steps.',
      );
      expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument();
    });
  });

  describe('the steps', () => {
    it('starts with what kind of game, showing every step to come', async () => {
      await renderPage();

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

    it('explains why each step matters, with an example', async () => {
      await renderPage();
      next();

      const why = screen.getByRole('complementary', { name: 'Why this matters' });
      expect(within(why).getByText(/a situation, not a plot/)).toBeInTheDocument();
      expect(within(why).getByText(/The dead are rising in Hommlet/)).toBeInTheDocument();
    });

    it('leaves out "Why this matters" when a step has nothing to say', async () => {
      await renderPage();
      await goToReview();

      expect(
        screen.queryByRole('complementary', { name: 'Why this matters' }),
      ).not.toBeInTheDocument();
    });

    it('offers a template for each kind of campaign, with an example', async () => {
      await renderPage();

      expect(screen.getAllByRole('radio')).toHaveLength(4);
      expect(screen.getByRole('radio', { name: /^Story arc/ })).toBeChecked();
      expect(
        screen.getByText('Six weekly sessions to stop a zombie plague in Greyhawk.'),
      ).toBeInTheDocument();
    });

    it('needs a name before leaving the pitch', async () => {
      await renderPage();
      next();

      next();
      expect(screen.getByText('Give your campaign a name to go on.')).toBeInTheDocument();
      expect(heading()).toHaveTextContent('The pitch');

      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();
      expect(heading()).toHaveTextContent('The table');
    });

    it('asks for six truths at most', async () => {
      await renderPage();
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

    it('keeps answers when going back and forward', async () => {
      await renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      fireEvent.change(input('tone'), { target: { value: 'grim' } });
      next();
      back();

      expect(input('name')).toHaveValue('Zombie Siege');
      expect(input('tone')).toHaveValue('grim');
    });

    it('jumps back to a step it has reached from the progress list', async () => {
      await renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      next();

      fireEvent.click(stepButton('Kind'));
      expect(heading()).toHaveTextContent('What kind of game?');
      fireEvent.click(stepButton('Table'));
      expect(heading()).toHaveTextContent('The table');
      expect(stepButton('World')).toBeDisabled();
    });

    it('moves focus to each new step', async () => {
      await renderPage();
      expect(heading()).not.toHaveFocus();

      next();
      expect(heading()).toHaveFocus();
    });
  });

  describe('the table', () => {
    it("lists the DM's characters to choose the party from", async () => {
      await renderPage();
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
      await renderPage();
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
      await renderPage();
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
      mockFetch.mockImplementation(
        withGuide((url: string) =>
          url === '/v1/compendium/packs' || url === '/v1/player-characters'
            ? jsonResponse([])
            : jsonResponse(sampleCampaign(), 201),
        ),
      );
      await renderPage();
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
      await renderPage();
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
      await renderPage();
      fireEvent.click(screen.getByRole('radio', { name: new RegExp(`^${title}`) }));
      await goToReview();

      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      await screen.findByText('Campaign page');
      expect(createdCampaign().template).toBe(template);
      expect(createdCampaign().campaign.mode).toBe(mode);
    });

    it('goes back to a step from its Edit link', async () => {
      await renderPage();
      await goToReview();

      fireEvent.click(screen.getByRole('button', { name: 'Edit the world' }));

      expect(heading()).toHaveTextContent('The world');
    });

    it('says what is still empty', async () => {
      await renderPage();
      await goToReview();

      expect(screen.getByText('Nothing yet. You can add it later.')).toBeInTheDocument();
      expect(screen.getByText('All compendiums')).toBeInTheDocument();
    });

    it('shows the server error and stays on the review', async () => {
      await renderPage();
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
      await renderPage();
      await goToReview();
      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      expect(await screen.findByText('Campaign page')).toBeInTheDocument();
    });
  });

  describe('the draft', () => {
    it('picks up where the DM left off', async () => {
      const first = await renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      first.unmount();

      await renderPage();

      expect(screen.getByText('Picking up where you left off.')).toBeInTheDocument();
      expect(heading()).toHaveTextContent('The pitch');
      expect(input('name')).toHaveValue('Zombie Siege');
    });

    it('starts over', async () => {
      const first = await renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });
      first.unmount();
      await renderPage();

      fireEvent.click(screen.getByRole('button', { name: 'Start over' }));

      expect(heading()).toHaveTextContent('What kind of game?');
      expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
      expect(screen.queryByText('Picking up where you left off.')).not.toBeInTheDocument();
    });

    it('saves nothing until the DM changes something', async () => {
      await renderPage();

      expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('forgets the draft once the campaign is created', async () => {
      await renderPage();
      await goToReview();
      expect(window.localStorage.getItem(DRAFT_KEY)).not.toBeNull();

      fireEvent.click(screen.getByRole('button', { name: 'Create campaign' }));

      await screen.findByText('Campaign page');
      expect(window.localStorage.getItem(DRAFT_KEY)).toBeNull();
    });

    it('ignores a draft it cannot read', async () => {
      window.localStorage.setItem(DRAFT_KEY, '{not json');

      await renderPage();

      expect(heading()).toHaveTextContent('What kind of game?');
      expect(screen.queryByText('Picking up where you left off.')).not.toBeInTheDocument();
    });

    it('keeps a restored step within the guide', async () => {
      window.localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ step: 99, furthest: 99, values: { name: 'Old' } }),
      );

      await renderPage();

      expect(heading()).toHaveTextContent('Review and create');
    });

    it('works when the browser will not store anything', async () => {
      const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });
      await renderPage();
      next();
      fireEvent.change(input('name'), { target: { value: 'Zombie Siege' } });

      expect(input('name')).toHaveValue('Zombie Siege');
      setItem.mockRestore();
    });
  });

  describe('suggesting a premise', () => {
    it('uses the party and setting so far', async () => {
      mockFetch.mockImplementation(
        withGuide(() => jsonResponse({ adventure_hook: 'Zombies rise in Hommlet' })),
      );
      await renderPage();
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
