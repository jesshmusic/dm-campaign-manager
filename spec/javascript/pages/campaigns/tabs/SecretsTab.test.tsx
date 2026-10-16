import React from 'react';
import { render, screen, fireEvent, waitFor, within } from '../../../test-utils';
import SecretsTab, {
  RevelationCheck,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SecretsTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, sampleCampaign } from '../fixtures';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(<SecretsTab campaign={campaign} state={state} />);
  return { campaign, state };
};

const input = (name: string) => document.getElementById(`field-${name}`) as HTMLInputElement;
const secrets = () => screen.getByRole('region', { name: 'Secrets and clues' });

describe('RevelationCheck', () => {
  it('explains the Three Clue Rule before any clues are grouped', () => {
    render(<RevelationCheck revelations={[]} />);

    expect(
      screen.getByText(/every conclusion the party needs should have at least 3 clues/),
    ).toBeInTheDocument();
  });

  it('warns about one revelation with too few clues', () => {
    render(
      <RevelationCheck
        revelations={[
          { name: 'Mayor is the cult leader', clueCount: 2, revealedCount: 0 },
          { name: 'The tunnel', clueCount: 3, revealedCount: 1 },
        ]}
      />,
    );

    expect(
      screen.getByText(
        '1 revelation has fewer than 3 clues. If the party misses one, they could get stuck.',
      ),
    ).toBeInTheDocument();
    expect(screen.getByText('Needs 1 more')).toBeInTheDocument();
    expect(screen.getAllByText(/Needs \d more/)).toHaveLength(1);
  });

  it('counts several thin revelations', () => {
    render(
      <RevelationCheck
        revelations={[
          { name: 'A', clueCount: 1, revealedCount: 0 },
          { name: 'B', clueCount: 0, revealedCount: 0 },
        ]}
      />,
    );

    expect(screen.getByText(/2 revelations have fewer than 3 clues/)).toBeInTheDocument();
    expect(screen.getByText('Needs 2 more')).toBeInTheDocument();
    expect(screen.getByText('Needs 3 more')).toBeInTheDocument();
  });

  it('lists each revelation with its clue and reveal counts', () => {
    render(
      <RevelationCheck
        revelations={[
          { name: 'A', clueCount: 1, revealedCount: 0 },
          { name: 'B', clueCount: 4, revealedCount: 2 },
        ]}
      />,
    );

    const items = screen.getAllByRole('listitem').map((item) => item.textContent);
    expect(items[0]).toMatch(/^A: 1 clue, 0 revealed/);
    expect(items[1]).toBe('B: 4 clues, 2 revealed');
  });

  it('confirms when every revelation has enough clues', () => {
    render(<RevelationCheck revelations={[{ name: 'A', clueCount: 3, revealedCount: 0 }]} />);

    expect(screen.getByText('Every revelation has at least 3 clues.')).toBeInTheDocument();
    expect(screen.queryByText(/Needs/)).not.toBeInTheDocument();
  });
});

describe('SecretsTab', () => {
  let confirmSpy: jest.SpyInstance;

  beforeEach(() => {
    confirmSpy = jest.spyOn(window, 'confirm').mockReturnValue(true);
  });

  afterEach(() => {
    confirmSpy.mockRestore();
  });

  it('checks the Three Clue Rule', () => {
    renderTab();

    expect(screen.getByText(/1 revelation has fewer than 3 clues/)).toBeInTheDocument();
  });

  it('lists hidden secrets before revealed ones', () => {
    renderTab(
      sampleCampaign({
        secrets: [...sampleCampaign().secrets].reverse(),
      }),
    );

    const texts = Array.from(secrets().querySelectorAll('p')).map((p) => p.textContent);
    expect(texts).toEqual([
      "Lareth wears the mayor's ring",
      'The mayor is a cultist',
      'The moathouse has a tunnel',
    ]);
  });

  it('shows what each secret points to and when it was revealed', () => {
    renderTab();

    const section = secrets();
    expect(within(section).getAllByText('Hidden')).toHaveLength(2);
    expect(within(section).getByText('Revealed')).toBeInTheDocument();
    expect(within(section).getByText('Mayor is the cult leader')).toBeInTheDocument();
    expect(within(section).getByText('Revealed in Session 1: Arrival')).toBeInTheDocument();
  });

  it('shows the empty text with no secrets', () => {
    renderTab(sampleCampaign({ secrets: [] }));

    expect(screen.getByText('No secrets yet.')).toBeInTheDocument();
  });

  it('suggests existing revelations when adding a secret', () => {
    renderTab();

    fireEvent.click(screen.getByRole('button', { name: 'Add secret' }));

    expect(
      screen.getByText(
        'The conclusion this clue supports, e.g. Mayor is the cult leader or The tunnel',
      ),
    ).toBeInTheDocument();
  });

  it('gives an example revelation when there are none yet', () => {
    renderTab(sampleCampaign({ revelations: [] }));

    fireEvent.click(screen.getByRole('button', { name: 'Add secret' }));

    expect(screen.getByText(/e\.g\. "The mayor is the cult leader"/)).toBeInTheDocument();
  });

  it('adds a secret', async () => {
    const { state } = renderTab();

    fireEvent.click(screen.getByRole('button', { name: 'Add secret' }));
    fireEvent.change(input('revelation'), { target: { value: 'Mayor is the cult leader' } });
    fireEvent.change(input('text'), { target: { value: 'The mayor has a holy symbol of Orcus' } });
    fireEvent.click(screen.getByRole('checkbox', { name: 'Already revealed to the players' }));
    fireEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Add secret' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'secrets',
        {
          revelation: 'Mayor is the cult leader',
          text: 'The mayor has a holy symbol of Orcus',
          revealed: true,
        },
        undefined,
      ),
    );
  });

  it('edits a secret', async () => {
    const { state } = renderTab();

    fireEvent.click(within(secrets()).getAllByRole('button', { name: 'Edit' })[0]);
    expect(input('text')).toHaveValue('The mayor is a cultist');
    fireEvent.change(input('text'), { target: { value: 'The mayor leads the cult' } });
    fireEvent.click(screen.getByRole('button', { name: 'Save' }));

    await waitFor(() =>
      expect(state.saveChild).toHaveBeenCalledWith(
        'secrets',
        {
          revelation: 'Mayor is the cult leader',
          text: 'The mayor leads the cult',
          revealed: false,
        },
        's1',
      ),
    );
  });

  it('deletes a secret after confirming', () => {
    const { state } = renderTab();

    fireEvent.click(within(secrets()).getAllByRole('button', { name: 'Delete' })[0]);

    expect(confirmSpy).toHaveBeenCalledWith("Delete this secret? This can't be undone.");
    expect(state.removeChild).toHaveBeenCalledWith('secrets', 's1');
  });
});
