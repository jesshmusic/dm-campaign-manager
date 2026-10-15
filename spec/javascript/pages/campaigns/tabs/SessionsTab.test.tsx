import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, within } from '../../../test-utils';
import SessionsTab, {
  formatDate,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/tabs/SessionsTab';
import { Campaign } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/types';
import { FakeState, makeState, plannerSession, sampleCampaign } from '../fixtures';

const renderTab = (campaign: Campaign = sampleCampaign(), state: FakeState = makeState()) => {
  render(
    <MemoryRouter>
      <SessionsTab campaign={campaign} state={state} />
    </MemoryRouter>,
  );
  return { campaign, state };
};

const cardFor = (title: string) =>
  screen.getByRole('link', { name: title }).closest('h3')?.parentElement
    ?.parentElement as HTMLElement;

const DATE_OPTIONS: Intl.DateTimeFormatOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
};

describe('formatDate', () => {
  it('formats an ISO date as a local calendar date', () => {
    // Parsed at local midnight, so the day never shifts with the time zone
    expect(formatDate('2026-10-08')).toBe(
      new Date(2026, 9, 8).toLocaleDateString(undefined, DATE_OPTIONS),
    );
  });

  it('includes the day and year', () => {
    expect(formatDate('2026-01-01')).toMatch(/1/);
    expect(formatDate('2026-01-01')).toMatch(/2026/);
  });
});

describe('SessionsTab', () => {
  it('lists sessions with their status', () => {
    renderTab();

    expect(within(cardFor('Session 1: Arrival')).getByText('Played')).toBeInTheDocument();
    expect(within(cardFor('Session 2')).getByText('Planned')).toBeInTheDocument();
  });

  it('describes each session', () => {
    renderTab();

    const first = cardFor('Session 1: Arrival');
    expect(
      within(first).getByText(`Session 1 · ${formatDate('2026-10-01')} · Level 3`),
    ).toBeInTheDocument();
    expect(within(first).getByText('Zombies attack the caravan')).toBeInTheDocument();
    expect(within(first).getByText('The party reached Hommlet')).toBeInTheDocument();
    // Untitled sessions already show their number in the title
    expect(
      within(cardFor('Session 2')).getByText(`${formatDate('2026-10-08')} · Level 4`),
    ).toBeInTheDocument();
  });

  it('links to prep and run each session', () => {
    renderTab();

    const card = cardFor('Session 2');
    expect(within(card).getByRole('link', { name: 'Session 2' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege/sessions/sess2',
    );
    expect(within(card).getByRole('link', { name: 'Prep' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege/sessions/sess2',
    );
    expect(within(card).getByRole('link', { name: 'Run' })).toHaveAttribute(
      'href',
      '/app/campaigns/zombie-siege/sessions/sess2?mode=run',
    );
  });

  it('adds a session at the level of the last one', () => {
    const { state } = renderTab();

    fireEvent.click(screen.getByRole('button', { name: 'Add session' }));

    expect(state.saveChild).toHaveBeenCalledWith('sessions', { level: 4 });
  });

  it('adds the first session at the starting level', () => {
    const { state } = renderTab(sampleCampaign({ sessions: [] }));

    expect(screen.getByText('No sessions yet.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Add session' }));

    expect(state.saveChild).toHaveBeenCalledWith('sessions', { level: 3 });
  });

  it('falls back to the starting level when the last session has none', () => {
    const { state } = renderTab(
      sampleCampaign({ sessions: [plannerSession({ id: 'x', level: null })] }),
    );

    fireEvent.click(screen.getByRole('button', { name: 'Add session' }));

    expect(state.saveChild).toHaveBeenCalledWith('sessions', { level: 3 });
  });
});
