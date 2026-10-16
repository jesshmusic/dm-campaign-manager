import React from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render, screen, fireEvent, waitFor } from '../../../test-utils';
import OutlineReview, {
  describeSection,
} from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/OutlineReview';
import { AssistantError } from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi';
import { assistantCampaign } from './campaignFixture';

const mockOutline = jest.fn();
const mockApplyOutline = jest.fn();
jest.mock(
  '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi',
  () => {
    const actual = jest.requireActual(
      '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/campaigns/assistant/useAssistantApi',
    );
    return {
      ...actual,
      __esModule: true,
      default: () => ({ outline: mockOutline, applyOutline: mockApplyOutline }),
    };
  },
);

const outline = {
  pitch: 'Survive the night.',
  npcs: [{ name: 'Kalvar', role: 'bbeg', motive: 'Undeath for all' }],
  secrets: [{ revelation: 'The crypt', text: 'Gravediggers fell first.' }],
  quests: [],
};

const renderReview = (onApplied = jest.fn(() => Promise.resolve())) => {
  render(
    <MemoryRouter>
      <OutlineReview campaign={assistantCampaign()} onApplied={onApplied} />
    </MemoryRouter>,
  );
  return onApplied;
};

describe('describeSection', () => {
  it('summarizes each section in one line per item', () => {
    expect(describeSection(outline, 'npcs')).toEqual(['Kalvar (bbeg): Undeath for all']);
    expect(describeSection(outline, 'secrets')).toEqual(['The crypt: Gravediggers fell first.']);
    expect(describeSection(outline, 'pitch')).toEqual(['Survive the night.']);
    expect(describeSection(outline, 'quests')).toEqual([]);
    expect(describeSection({ sessions: [{ number: 2, title: 'Refuge' }] }, 'sessions')).toEqual([
      'Session 2: Refuge',
    ]);
  });
});

describe('OutlineReview', () => {
  beforeEach(() => {
    mockOutline.mockReset();
    mockApplyOutline.mockReset();
  });

  it('drafts a plan and lists only the sections it filled', async () => {
    mockOutline.mockResolvedValue(outline);
    renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Draft a plan' }));

    expect(await screen.findByText('Kalvar (bbeg): Undeath for all')).toBeInTheDocument();
    expect(mockOutline).toHaveBeenCalledWith('the-grey-plague');
    expect(screen.getByText('Cast')).toBeInTheDocument();
    expect(screen.queryByText('Quests')).not.toBeInTheDocument();
  });

  it('adds only the checked sections', async () => {
    mockOutline.mockResolvedValue(outline);
    mockApplyOutline.mockResolvedValue({});
    const onApplied = renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Draft a plan' }));
    await screen.findByText('Cast');
    fireEvent.click(screen.getByRole('checkbox', { name: 'Cast' }));
    fireEvent.click(screen.getByRole('button', { name: 'Add to campaign' }));

    await waitFor(() => expect(onApplied).toHaveBeenCalled());
    expect(mockApplyOutline).toHaveBeenCalledWith('the-grey-plague', outline, ['pitch', 'secrets']);
  });

  it('can discard a draft', async () => {
    mockOutline.mockResolvedValue(outline);
    renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Draft a plan' }));
    fireEvent.click(await screen.findByRole('button', { name: 'Discard' }));

    expect(screen.getByRole('button', { name: 'Draft a plan' })).toBeInTheDocument();
    expect(mockApplyOutline).not.toHaveBeenCalled();
  });

  it('points to the dashboard when the DM has no OpenAI key', async () => {
    mockOutline.mockRejectedValue(new AssistantError('Add your key', true));
    renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Draft a plan' }));

    expect(
      await screen.findByRole('link', { name: 'Add a key in your dashboard' }),
    ).toHaveAttribute('href', '/app/user-dashboard');
  });

  it('shows other AI errors', async () => {
    mockOutline.mockRejectedValue(new AssistantError('The AI service failed: timeout'));
    renderReview();

    fireEvent.click(screen.getByRole('button', { name: 'Draft a plan' }));

    expect(await screen.findByText('The AI service failed: timeout')).toBeInTheDocument();
  });
});
