import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import EntityForm, { toFormValues } from '../components/EntityForm';
import ProgressClock from '../components/ProgressClock';
import { campaignFields, campaignModeField, campaignStatusField } from '../campaignFields';
import { CampaignState } from '../useCampaign';
import { Campaign, MODE_LABELS } from '../types';
import { RevelationCheck } from './SecretsTab';
import OutlineReview from '../assistant/OutlineReview';
import GettingStarted from './GettingStarted';
import CompendiumPicker from '../components/CompendiumPicker';
import { useCompendiumPacks } from '../compendium';
import { formatDate } from './SessionsTab';
import { ButtonRow, Card, CardGrid, List, Meta, Notice, SectionTitle } from '../Campaigns.styles';

// Plain-text handout for session zero
export const playerGuideText = (campaign: Campaign) =>
  [
    campaign.name,
    campaign.settingName && `Setting: ${campaign.settingName}`,
    campaign.pitch,
    campaign.truths.length > 0 &&
      ['Truths of the world:', ...campaign.truths.map((truth) => `- ${truth}`)].join('\n'),
  ]
    .filter(Boolean)
    .join('\n\n');

type OverviewTabProps = {
  campaign: Campaign;
  state: CampaignState;
};

const OverviewTab = ({ campaign, state }: OverviewTabProps) => {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const fields = [campaignStatusField, campaignModeField, ...campaignFields(state.api)];
  const packs = useCompendiumPacks(state.api);
  // Each change saves the whole list, so wait for one save before the next
  const [savingPacks, setSavingPacks] = useState(false);

  const saveExcludedPacks = async (excluded: string[]) => {
    setSavingPacks(true);
    await state.updateCampaign({ excluded_compendium_packs: excluded });
    setSavingPacks(false);
  };

  const upcoming = campaign.sessions.find((session) => session.status !== 'played');
  const activeQuests = campaign.quests.filter((quest) => quest.status === 'active');

  const copyPlayerGuide = async () => {
    await navigator.clipboard.writeText(playerGuideText(campaign));
    setCopied(true);
  };

  const [deleteError, setDeleteError] = useState<string | null>(null);

  const deleteCampaign = async () => {
    if (!window.confirm(`Delete "${campaign.name}" and everything in it? This can't be undone.`))
      return;
    try {
      await state.api.deleteCampaign(campaign.slug);
      navigate('/app/campaigns');
    } catch {
      setDeleteError('Could not delete the campaign. Please try again.');
    }
  };

  const editForm = editing && (
    <EntityForm
      title="Edit campaign"
      fields={fields}
      initialValues={toFormValues(fields, {
        ...campaign,
        setting_name: campaign.settingName,
        setting_notes: campaign.settingNotes,
        party_size: campaign.partySize,
        start_level: campaign.startLevel,
        target_level: campaign.targetLevel,
        planned_sessions: campaign.plannedSessions,
      })}
      submitLabel="Save"
      onSubmit={(attributes) => state.updateCampaign(attributes)}
      onCancel={() => setEditing(false)}
    />
  );

  const details = [
    MODE_LABELS[campaign.mode],
    campaign.settingName,
    campaign.partySize && `${campaign.partySize} players`,
    campaign.startLevel &&
      (campaign.targetLevel && campaign.targetLevel !== campaign.startLevel
        ? `Levels ${campaign.startLevel}–${campaign.targetLevel}`
        : `Level ${campaign.startLevel}`),
    campaign.plannedSessions && `${campaign.plannedSessions} sessions`,
    campaign.cadence,
    campaign.tone,
  ].filter(Boolean);

  return (
    <>
      {editForm}
      <Meta>{details.join(' · ')}</Meta>
      <ButtonRow>
        <Button color={Colors.primary} title="Edit campaign" onClick={() => setEditing(true)} />
        <Button
          color={Colors.secondary}
          title={copied ? 'Copied!' : 'Copy player guide'}
          onClick={() => void copyPlayerGuide()}
        />
      </ButtonRow>

      <GettingStarted campaign={campaign} />

      <CardGrid>
        <Card>
          <h3>Premise</h3>
          <p>{campaign.premise ?? 'No premise yet.'}</p>
        </Card>
        <Card>
          <h3>Pitch for your players</h3>
          <p>{campaign.pitch ?? 'No pitch yet.'}</p>
        </Card>
        <Card>
          <h3>Truths of the setting</h3>
          {campaign.truths.length > 0 ? (
            <List>
              {campaign.truths.map((truth) => (
                <li key={truth}>{truth}</li>
              ))}
            </List>
          ) : (
            <p>No truths yet.</p>
          )}
        </Card>
      </CardGrid>

      <SectionTitle>Plan with AI</SectionTitle>
      <OutlineReview campaign={campaign} onApplied={state.reload} />

      <SectionTitle>Where things stand</SectionTitle>
      <CardGrid>
        <Card>
          <h3>Next session</h3>
          {upcoming ? (
            <>
              <p>{upcoming.displayTitle}</p>
              {upcoming.scheduledOn && <Meta>{formatDate(upcoming.scheduledOn)}</Meta>}
            </>
          ) : (
            <p>No upcoming session.</p>
          )}
        </Card>
        <Card>
          <h3>Active quests</h3>
          {activeQuests.length > 0 ? (
            <List>
              {activeQuests.map((quest) => (
                <li key={quest.id}>{quest.name}</li>
              ))}
            </List>
          ) : (
            <p>None yet.</p>
          )}
        </Card>
        {campaign.fronts.map((front) => (
          <Card key={front.id}>
            <h3>{front.name}</h3>
            <ProgressClock
              name={front.name}
              segments={front.clockSegments}
              filled={front.clockFilled}
              size={56}
            />
          </Card>
        ))}
      </CardGrid>

      <SectionTitle>Secrets and clues</SectionTitle>
      <RevelationCheck revelations={campaign.revelations} />

      <SectionTitle>Compendiums</SectionTitle>
      <Card>
        <Meta>
          Your Foundry compendiums. Monster and treasure searches in this campaign use the checked
          ones.
        </Meta>
        <CompendiumPicker
          packs={packs}
          excluded={campaign.excludedCompendiumPacks}
          onChange={(excluded) => void saveExcludedPacks(excluded)}
          disabled={savingPacks}
        />
      </Card>

      <SectionTitle>Danger zone</SectionTitle>
      <Notice $tone="danger">
        Deleting a campaign removes all of its NPCs, places, quests, secrets and sessions.
      </Notice>
      {deleteError && <Notice>{deleteError}</Notice>}
      <Button color={Colors.danger} title="Delete campaign" onClick={() => void deleteCampaign()} />
    </>
  );
};

export default OverviewTab;
