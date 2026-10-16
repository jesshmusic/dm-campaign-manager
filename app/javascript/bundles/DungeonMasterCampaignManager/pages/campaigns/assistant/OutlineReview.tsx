import { useState } from 'react';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import useAssistantApi, { AssistantError, Outline, OutlineSection } from './useAssistantApi';
import AssistantNotice from './AssistantNotice';
import { Campaign } from '../types';
import { ButtonRow, Card, CheckboxField, List, Meta } from '../Campaigns.styles';

const SECTION_LABELS: Record<OutlineSection, string> = {
  pitch: 'Player pitch',
  truths: 'Truths of the setting',
  factions: 'Factions',
  npcs: 'Cast',
  fronts: 'Fronts and clocks',
  locations: 'Places',
  quests: 'Quests',
  secrets: 'Secrets and clues',
  sessions: 'Session strong starts and scenes',
};

// One line per proposed item, for the review list
export const describeSection = (outline: Outline, section: OutlineSection): string[] => {
  switch (section) {
    case 'pitch':
      return outline.pitch ? [outline.pitch] : [];
    case 'truths':
      return outline.truths ?? [];
    case 'factions':
      return (outline.factions ?? []).map((f) => (f.goal ? `${f.name}: ${f.goal}` : f.name));
    case 'npcs':
      return (outline.npcs ?? []).map(
        (n) => `${n.name}${n.role ? ` (${n.role})` : ''}${n.motive ? `: ${n.motive}` : ''}`,
      );
    case 'fronts':
      return (outline.fronts ?? []).map((f) => (f.goal ? `${f.name}: ${f.goal}` : f.name));
    case 'locations':
      return (outline.locations ?? []).map((l) => l.name);
    case 'quests':
      return (outline.quests ?? []).map(
        (q) => `${q.name}${q.kind ? ` (${q.kind}${q.act ? `, act ${q.act}` : ''})` : ''}`,
      );
    case 'secrets':
      return (outline.secrets ?? []).map((s) =>
        s.revelation ? `${s.revelation}: ${s.text}` : s.text,
      );
    case 'sessions':
      return (outline.sessions ?? []).map(
        (s) => `Session ${s.number}${s.title ? `: ${s.title}` : ''}`,
      );
    default:
      return [];
  }
};

type OutlineReviewProps = {
  campaign: Campaign;
  onApplied: () => Promise<void>;
};

/**
 * Drafts a campaign plan with AI from the brief, then lets the DM pick which
 * parts to add. Nothing is saved until "Add to campaign".
 */
const OutlineReview = ({ campaign, onApplied }: OutlineReviewProps) => {
  const api = useAssistantApi();
  const [outline, setOutline] = useState<Outline | null>(null);
  const [selected, setSelected] = useState<OutlineSection[]>([]);
  const [busy, setBusy] = useState<'drafting' | 'applying' | null>(null);
  const [error, setError] = useState<AssistantError | null>(null);

  const sections = outline
    ? (Object.keys(SECTION_LABELS) as OutlineSection[]).filter(
        (section) => describeSection(outline, section).length > 0,
      )
    : [];

  const draft = async () => {
    setBusy('drafting');
    setError(null);
    try {
      const result = await api.outline(campaign.slug);
      setOutline(result);
      setSelected(
        (Object.keys(SECTION_LABELS) as OutlineSection[]).filter(
          (s) => describeSection(result, s).length,
        ),
      );
    } catch (e) {
      setError(e instanceof AssistantError ? e : new AssistantError('Could not draft a plan.'));
    } finally {
      setBusy(null);
    }
  };

  const apply = async () => {
    if (!outline) return;
    setBusy('applying');
    setError(null);
    try {
      await api.applyOutline(campaign.slug, outline, selected);
      setOutline(null);
      await onApplied();
    } catch (e) {
      setError(e instanceof AssistantError ? e : new AssistantError('Could not add the plan.'));
    } finally {
      setBusy(null);
    }
  };

  const toggle = (section: OutlineSection) =>
    setSelected((current) =>
      current.includes(section) ? current.filter((s) => s !== section) : [...current, section],
    );

  return (
    <Card>
      <Meta>
        Draft a cast, threats, places, quests and clues from your brief. You choose what to keep;
        existing entries are left alone.
      </Meta>
      <AssistantNotice error={error} />
      {!outline && (
        <ButtonRow>
          <Button
            color={Colors.primary}
            title={busy === 'drafting' ? 'Drafting… (this can take a minute)' : 'Draft a plan'}
            disabled={busy !== null}
            onClick={() => void draft()}
          />
        </ButtonRow>
      )}
      {outline && (
        <>
          {sections.map((section) => (
            <div key={section}>
              <CheckboxField>
                <input
                  type="checkbox"
                  checked={selected.includes(section)}
                  onChange={() => toggle(section)}
                />
                <strong>{SECTION_LABELS[section]}</strong>
              </CheckboxField>
              <List>
                {describeSection(outline, section).map((line, index) => (
                  <li key={`${section}-${index}`}>{line}</li>
                ))}
              </List>
            </div>
          ))}
          <ButtonRow>
            <Button
              color={Colors.primary}
              title={busy === 'applying' ? 'Adding…' : 'Add to campaign'}
              disabled={busy !== null || selected.length === 0}
              onClick={() => void apply()}
            />
            <Button color={Colors.secondary} title="Discard" onClick={() => setOutline(null)} />
            <Button
              color={Colors.secondary}
              title="Try again"
              disabled={busy !== null}
              onClick={() => void draft()}
            />
          </ButtonRow>
        </>
      )}
    </Card>
  );
};

export default OutlineReview;
