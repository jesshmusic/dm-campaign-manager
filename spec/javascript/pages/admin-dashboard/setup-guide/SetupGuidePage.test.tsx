import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import SetupGuidePage from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/admin-dashboard/setup-guide/SetupGuidePage';
import { jsonResponse, setupGuide } from '../../campaigns/fixtures';

const mockGetAccessTokenSilently = jest.fn(() => Promise.resolve('test-token'));
jest.mock('@auth0/auth0-react', () => ({
  useAuth0: () => ({ getAccessTokenSilently: mockGetAccessTokenSilently }),
}));

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/containers/PageContainer',
  () =>
    function MockPageContainer({ children }: { children: React.ReactNode }) {
      return <div data-testid="page-container">{children}</div>;
    },
);

jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/components/PageTitle/PageTitle',
  () =>
    function MockPageTitle({ title }: { title: string }) {
      return <h1>{title}</h1>;
    },
);

const GUIDE_URL = '/v1/setup_guide';

const renderPage = async () => {
  const page = render(
    <MemoryRouter>
      <SetupGuidePage />
    </MemoryRouter>,
  );
  await screen.findByRole('region', { name: 'Step 1: Kind' });
  return page;
};

const step = (name: string) => screen.getByRole('region', { name });
const template = (name: string) => screen.getByRole('region', { name: `Template: ${name}` });
const field = (region: HTMLElement, label: RegExp) => within(region).getByLabelText(label);
const type = (element: HTMLElement, value: string) =>
  fireEvent.change(element, { target: { value } });
const saveButton = () => screen.getByRole('button', { name: 'Save' });
const cancelButton = () => screen.getByRole('button', { name: 'Cancel' });

describe('SetupGuidePage', () => {
  let mockFetch: jest.Mock;

  const patchRequest = () =>
    mockFetch.mock.calls.find(
      ([url, init]: [string, RequestInit]) => url === GUIDE_URL && init.method === 'PATCH',
    );
  const patchBody = () => JSON.parse(patchRequest()[1].body);

  beforeEach(() => {
    mockFetch = jest.fn((url: string, init: RequestInit) => {
      if (init.method === 'PATCH') {
        const guide = setupGuide();
        guide.steps[1] = { ...guide.steps[1], title: 'Your pitch' };
        return jsonResponse(guide);
      }
      return jsonResponse(setupGuide());
    });
    global.fetch = mockFetch;
  });

  describe('loading', () => {
    it('shows a card of words for every step and template', async () => {
      await renderPage();

      expect(screen.getAllByRole('region', { name: /^Step \d/ })).toHaveLength(6);
      expect(screen.getAllByRole('region', { name: /^Template: / })).toHaveLength(4);
      const pitch = step('Step 2: Pitch');
      expect(field(pitch, /^Label/)).toHaveValue('Pitch');
      expect(field(pitch, /^Title/)).toHaveValue('The pitch');
      expect(field(pitch, /^Intro/)).toHaveValue(
        'Give your campaign a name, and say what it is about in a sentence or two.',
      );
      expect(field(pitch, /^Why this matters/)).toHaveValue(
        'A good premise is a situation, not a plot.',
      );
      expect(field(pitch, /^Example/)).toHaveValue(
        'The dead are rising in Hommlet. Tone: survival horror.',
      );
      expect(field(step('Step 6: Review'), /^Why this matters/)).toHaveValue('');
      const oneShot = template('One-shot');
      expect(field(oneShot, /^Title/)).toHaveValue('One-shot');
      expect(field(oneShot, /^Description/)).toHaveValue(
        'A single adventure built on the five-room dungeon.',
      );
      expect(field(oneShot, /^Example/)).toHaveValue('One stormy night in a haunted lighthouse.');
    });

    it("asks the server for fresh words, not the browser's copy", async () => {
      await renderPage();

      expect(mockFetch).toHaveBeenCalledWith(
        GUIDE_URL,
        expect.objectContaining({ method: 'GET', cache: 'no-cache' }),
      );
    });

    it('limits each field to what the server takes', async () => {
      await renderPage();

      const kind = step('Step 1: Kind');
      expect(field(kind, /^Title/)).toHaveAttribute('maxLength', '60');
      expect(field(kind, /^Intro/)).toHaveAttribute('maxLength', '2000');
    });

    it('shows a loading message first', async () => {
      render(
        <MemoryRouter>
          <SetupGuidePage />
        </MemoryRouter>,
      );

      expect(screen.getByText('Loading the guide…')).toBeInTheDocument();
      expect(screen.queryByRole('button', { name: 'Save' })).not.toBeInTheDocument();
      await screen.findByRole('region', { name: 'Step 1: Kind' });
      expect(screen.queryByText('Loading the guide…')).not.toBeInTheDocument();
    });

    it('offers to try again when the words do not load', async () => {
      mockFetch.mockImplementation(() => jsonResponse({ errors: ['Down'] }, 500));
      render(
        <MemoryRouter>
          <SetupGuidePage />
        </MemoryRouter>,
      );

      expect(await screen.findByRole('alert')).toHaveTextContent('Could not load the setup guide.');

      mockFetch.mockImplementation(() => jsonResponse(setupGuide()));
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));

      expect(await screen.findByRole('region', { name: 'Step 1: Kind' })).toBeInTheDocument();
      expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('links back to the admin dashboard', async () => {
      await renderPage();

      expect(screen.getByRole('link', { name: '← Admin dashboard' })).toHaveAttribute(
        'href',
        '/app/admin-dashboard',
      );
    });
  });

  describe('saving', () => {
    it('waits for a change', async () => {
      await renderPage();

      expect(saveButton()).toBeDisabled();
      expect(cancelButton()).toBeDisabled();

      type(field(step('Step 2: Pitch'), /^Title/), 'Your pitch');

      expect(saveButton()).toBeEnabled();
      expect(cancelButton()).toBeEnabled();
    });

    it('sends only the steps and templates that changed, with all their words', async () => {
      await renderPage();
      type(field(step('Step 2: Pitch'), /^Title/), 'Your pitch');
      type(field(template('Sandbox'), /^Example/), 'Roam the Wild Coast.');

      fireEvent.click(saveButton());

      expect(
        await screen.findByText(/Saved. The website and the Foundry module show the new words/),
      ).toBeInTheDocument();
      expect(patchBody()).toEqual({
        steps: [{ ...setupGuide().steps[1], title: 'Your pitch' }],
        templates: [{ ...setupGuide().templates[1], example: 'Roam the Wild Coast.' }],
      });
    });

    it('shows the saved words and waits for the next change', async () => {
      await renderPage();
      type(field(step('Step 2: Pitch'), /^Title/), 'Your pitch');

      fireEvent.click(saveButton());

      await screen.findByRole('status');
      expect(field(step('Step 2: Pitch'), /^Title/)).toHaveValue('Your pitch');
      expect(saveButton()).toBeDisabled();
    });

    it('sends an emptied "Why this matters" as nothing', async () => {
      await renderPage();
      type(field(step('Step 2: Pitch'), /^Why this matters/), '');

      fireEvent.click(saveButton());

      await screen.findByRole('status');
      expect(patchBody().steps[0].why).toBeNull();
      expect(patchBody().templates).toEqual([]);
    });

    it("shows the server's errors and keeps the changes", async () => {
      await renderPage();
      mockFetch.mockImplementation(() =>
        jsonResponse({ errors: ["Pitch step: Title can't be blank"] }, 422),
      );
      type(field(step('Step 2: Pitch'), /^Title/), '');

      fireEvent.click(saveButton());

      expect(await screen.findByRole('alert')).toHaveTextContent(
        "Pitch step: Title can't be blank",
      );
      expect(field(step('Step 2: Pitch'), /^Title/)).toHaveValue('');
      await waitFor(() => expect(saveButton()).toBeEnabled());
    });

    it('says it is saving', async () => {
      await renderPage();
      mockFetch.mockImplementation(() => new Promise(() => undefined));
      type(field(step('Step 1: Kind'), /^Label/), 'Type');

      fireEvent.click(saveButton());

      expect(await screen.findByRole('button', { name: 'Saving…' })).toBeDisabled();
    });

    it('puts the saved words back on Cancel', async () => {
      await renderPage();
      type(field(step('Step 1: Kind'), /^Label/), 'Type');
      type(field(template('Blank'), /^Description/), 'Nothing.');

      fireEvent.click(cancelButton());

      expect(field(step('Step 1: Kind'), /^Label/)).toHaveValue('Kind');
      expect(field(template('Blank'), /^Description/)).toHaveValue(
        'Start from scratch and build it your way.',
      );
      expect(saveButton()).toBeDisabled();
      expect(patchRequest()).toBeUndefined();
    });
  });
});
