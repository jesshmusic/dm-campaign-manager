import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../../../test-utils';
import GettingStarted from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/GettingStarted';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { playerCharacter, sampleCampaign } from '../fixtures';

const renderList = (campaign: Campaign) =>
  render(
    <MemoryRouter>
      <GettingStarted campaign={campaign} />
    </MemoryRouter>,
  );

const stepFor = (label: string) =>
  screen.getByRole('link', { name: label }).closest('li') as HTMLElement;

// Everything the list asks for
const finished = (overrides: Partial<Campaign> = {}) => {
  const campaign = sampleCampaign();
  return sampleCampaign({
    party: [playerCharacter()],
    npcs: [campaign.npcs[0], campaign.npcs[0], campaign.npcs[0]],
    revelations: [{ name: 'The tunnel', clueCount: 3, revealedCount: 0 }],
    sessions: campaign.sessions.map((session) => ({ ...session, strongStart: 'The bells toll' })),
    ...overrides,
  });
};

describe('GettingStarted', () => {
  beforeEach(() => window.localStorage.clear());

  it('lists what to do next, with what is done', () => {
    renderList(
      finished({ party: [], revelations: [{ name: 'Mayor', clueCount: 2, revealedCount: 0 }] }),
    );

    expect(screen.getByRole('heading', { name: 'Getting started' })).toBeInTheDocument();
    expect(screen.getByText('3 of 5 done')).toBeInTheDocument();
    expect(within(stepFor('Choose the party')).queryByText('Done')).not.toBeInTheDocument();
    expect(within(stepFor('Give your villain a threat')).getByText('Done')).toBeInTheDocument();
    expect(within(stepFor('Hide some secrets')).queryByText('Done')).not.toBeInTheDocument();
    expect(
      within(stepFor('Hide some secrets')).getByText(/more than one way to find it/),
    ).toBeInTheDocument();
  });

  it('links each step to where it is done', () => {
    const campaign = finished({ party: [] });
    renderList(campaign);
    const first = [...campaign.sessions].sort((a, b) => a.number - b.number)[0];

    expect(screen.getByRole('link', { name: 'Choose the party' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege?tab=party',
    );
    expect(screen.getByRole('link', { name: 'Add the cast' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege?tab=cast',
    );
    expect(screen.getByRole('link', { name: 'Prep the first session' })).toHaveAttribute(
      'href',
      `/app/campaigns/zombie-siege/sessions/${first.id}?mode=prep`,
    );
  });

  it('sends the DM to the sessions tab when there are no sessions', () => {
    renderList(finished({ sessions: [] }));

    expect(screen.getByRole('link', { name: 'Prep the first session' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege?tab=sessions',
    );
  });

  it('counts a campaign without revelations as having secrets still to hide', () => {
    renderList(finished({ revelations: [] }));

    expect(within(stepFor('Hide some secrets')).queryByText('Done')).not.toBeInTheDocument();
  });

  it('goes away when everything is done', () => {
    renderList(finished());

    expect(screen.queryByRole('heading', { name: 'Getting started' })).not.toBeInTheDocument();
  });

  it('stays hidden once the DM hides it', () => {
    const campaign = finished({ party: [] });
    const first = renderList(campaign);

    fireEvent.click(screen.getByRole('button', { name: 'Hide this list' }));
    expect(screen.queryByRole('heading', { name: 'Getting started' })).not.toBeInTheDocument();
    first.unmount();

    renderList(campaign);
    expect(screen.queryByRole('heading', { name: 'Getting started' })).not.toBeInTheDocument();
  });

  it('hides for now when the browser will not store anything', () => {
    const setItem = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new Error('blocked');
    });
    renderList(finished({ party: [] }));

    fireEvent.click(screen.getByRole('button', { name: 'Hide this list' }));

    expect(screen.queryByRole('heading', { name: 'Getting started' })).not.toBeInTheDocument();
    setItem.mockRestore();
  });
});
