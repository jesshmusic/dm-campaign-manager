import { useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import useAssistantApi, { AssistantError, RecapProposal } from './useAssistantApi';
import AssistantNotice from './AssistantNotice';
import { CampaignState } from '../useCampaign';
import { Campaign, PlannerSession } from '../types';
import { QUEST_STATUS_LABELS } from '../quest/questDetails';
import { ButtonRow, Card, CheckboxField, Meta, TextArea } from '../Campaigns.styles';

type Change = { key: string; label: string; apply: () => Promise<boolean> };

type RecapDraftProps = {
  campaign: Campaign;
  session: PlannerSession;
  state: CampaignState;
};

/**
 * Drafts a recap from the session log with AI, plus suggested changes
 * (secrets revealed, clocks advanced, quest updates). The DM edits the recap,
 * ticks the changes to keep, and applies them.
 */
const RecapDraft = ({ campaign, session, state }: RecapDraftProps) => {
  const api = useAssistantApi();
  const [proposal, setProposal] = useState<RecapProposal | null>(null);
  const [recap, setRecap] = useState('');
  const [chosen, setChosen] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<AssistantError | null>(null);

  const changes: Change[] = proposal
    ? [
        ...proposal.revealed_secret_ids.flatMap((id) => {
          const secret = campaign.secrets.find((s) => s.id === String(id));
          return secret
            ? [
                {
                  key: `secret-${id}`,
                  label: `Reveal: ${secret.text}`,
                  apply: () =>
                    state.saveChild(
                      'secrets',
                      { revealed: true, revealed_session_id: session.id },
                      secret.id,
                    ),
                },
              ]
            : [];
        }),
        ...proposal.clock_advances.flatMap(({ front_id: frontId, segments }) => {
          const front = campaign.fronts.find((f) => f.id === String(frontId));
          return front
            ? [
                {
                  key: `front-${frontId}`,
                  label: `Advance ${front.name} by ${segments}`,
                  apply: () =>
                    state.saveChild(
                      'fronts',
                      { clock_filled: Math.min(front.clockSegments, front.clockFilled + segments) },
                      front.id,
                    ),
                },
              ]
            : [];
        }),
        ...proposal.quest_updates.flatMap(({ quest_id: questId, status }) => {
          const quest = campaign.quests.find((q) => q.id === String(questId));
          return quest
            ? [
                {
                  key: `quest-${questId}`,
                  label: `${quest.name}: ${QUEST_STATUS_LABELS[status]}`,
                  apply: () => state.saveChild('quests', { status }, quest.id),
                },
              ]
            : [];
        }),
      ]
    : [];

  const draft = async () => {
    setBusy(true);
    setError(null);
    try {
      const result = await api.recap(campaign.slug, session.id);
      setProposal(result);
      setRecap(result.recap);
      setChosen([
        ...result.revealed_secret_ids.map((id) => `secret-${id}`),
        ...result.clock_advances.map((a) => `front-${a.front_id}`),
        ...result.quest_updates.map((u) => `quest-${u.quest_id}`),
      ]);
    } catch (e) {
      setError(e instanceof AssistantError ? e : new AssistantError('Could not draft a recap.'));
    } finally {
      setBusy(false);
    }
  };

  const apply = async () => {
    setBusy(true);
    for (const change of changes.filter((c) => chosen.includes(c.key))) {
      // Run in order so each refresh sees the previous change
      await change.apply();
    }
    await state.saveChild('sessions', { recap: recap.trim() || null }, session.id);
    setProposal(null);
    setBusy(false);
  };

  const toggle = (key: string) =>
    setChosen((current) =>
      current.includes(key) ? current.filter((k) => k !== key) : [...current, key],
    );

  return (
    <Card>
      <h3>Recap with AI</h3>
      <Meta>Drafts a recap from your session log and suggests what changed in the campaign.</Meta>
      <AssistantNotice error={error} />
      {!proposal && (
        <ButtonRow>
          <Button
            color={Colors.primary}
            title={busy ? 'Drafting…' : 'Draft recap'}
            disabled={busy || !session.log}
            onClick={() => void draft()}
          />
          {!session.log && <Meta>Write a session log first.</Meta>}
        </ButtonRow>
      )}
      {proposal && (
        <>
          <TextArea
            aria-label="Drafted recap"
            value={recap}
            onChange={(event) => setRecap(event.target.value)}
          />
          {changes.length > 0 && <strong>Suggested changes</strong>}
          {changes.map((change) => (
            <CheckboxField key={change.key}>
              <input
                type="checkbox"
                checked={chosen.includes(change.key)}
                onChange={() => toggle(change.key)}
              />
              {change.label}
            </CheckboxField>
          ))}
          <ButtonRow>
            <Button
              color={Colors.primary}
              title={busy ? 'Saving…' : 'Save recap and changes'}
              disabled={busy}
              onClick={() => void apply()}
            />
            <Button color={Colors.secondary} title="Discard" onClick={() => setProposal(null)} />
          </ButtonRow>
        </>
      )}
    </Card>
  );
};

export default RecapDraft;
