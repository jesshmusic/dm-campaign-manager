import { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import AutosaveField from '../components/AutosaveField';
import ProgressClock from '../components/ProgressClock';
import { formatCoins } from '../coins';
import SceneThumbnail, { SceneGallery } from '../components/SceneThumbnail';
import { CampaignState } from '../useCampaign';
import {
  Campaign,
  ENCOUNTER_KIND_LABELS,
  NPC_ROLE_LABELS,
  PlannerSession,
  QuestStatus,
  Secret,
} from '../types';
import { difficultySummary } from '../quest/difficulty';
import { questEncounters } from '../quest/encounterDraft';
import { QUEST_STATUS_LABELS } from '../quest/questDetails';
import {
  encounterRewardSummary,
  linkGroups,
  nameWithQuantity,
  rewardSummary,
} from '../quest/questLinks';
import {
  Badge,
  Card,
  CardGrid,
  CheckboxField,
  EmptyState,
  HelperButton,
  List,
  Meta,
  SectionTitle,
  Select,
} from '../Campaigns.styles';

type RunViewProps = {
  campaign: Campaign;
  session: PlannerSession;
  state: CampaignState;
};

/** At the table: reveal secrets, advance clocks, track quests and keep a log. */
const RunView = ({ campaign, session, state }: RunViewProps) => {
  const { saveChild } = state;
  const [playedScenes, setPlayedScenes] = useState<string[]>([]);

  const linkedIds = (type: string) =>
    session.links.filter((link) => link.linkableType === type).map((link) => link.linkableId);
  const pickedSecretIds = linkedIds('CampaignSecret');
  const pickedSecrets = campaign.secrets.filter((secret) => pickedSecretIds.includes(secret.id));
  const otherSecrets = campaign.secrets.filter(
    (secret) => !secret.revealed && !pickedSecretIds.includes(secret.id),
  );
  const npcs = campaign.npcs.filter((npc) => linkedIds('CampaignNpc').includes(npc.id));
  const locations = campaign.locations.filter((location) =>
    linkedIds('CampaignLocation').includes(location.id),
  );
  const monsters = session.links.filter((link) => link.linkableType === 'Monster');
  const bookReferences = session.links.filter((link) => link.linkableType === 'CampaignReference');
  const openQuests = campaign.quests.filter(
    (quest) => quest.status === 'active' || quest.status === 'available',
  );
  const coins = formatCoins(session.treasureCurrency);

  const reveal = (secret: Secret, revealed: boolean) =>
    saveChild(
      'secrets',
      { revealed, revealed_session_id: revealed ? session.id : null },
      secret.id,
    );

  const toggleScene = (scene: string) =>
    setPlayedScenes((current) =>
      current.includes(scene) ? current.filter((s) => s !== scene) : [...current, scene],
    );

  const renderSecret = (secret: Secret) => (
    <li key={secret.id}>
      {secret.text}{' '}
      {secret.revealed ? (
        <>
          <Badge $tone="success">Revealed</Badge>{' '}
          <HelperButton type="button" onClick={() => void reveal(secret, false)}>
            Undo
          </HelperButton>
        </>
      ) : (
        <HelperButton type="button" onClick={() => void reveal(secret, true)}>
          Reveal
        </HelperButton>
      )}
    </li>
  );

  return (
    <>
      <CardGrid>
        <Card>
          <h3>Strong start</h3>
          <p>{session.strongStart ?? 'No strong start prepped.'}</p>
        </Card>
        <Card>
          <h3>Scenes</h3>
          {session.scenes.length === 0 && <EmptyState>No scenes prepped.</EmptyState>}
          {session.scenes.map((scene) => (
            <CheckboxField key={scene}>
              <input
                type="checkbox"
                checked={playedScenes.includes(scene)}
                onChange={() => toggleScene(scene)}
              />
              {scene}
            </CheckboxField>
          ))}
        </Card>
      </CardGrid>

      <SectionTitle>Secrets and clues</SectionTitle>
      {pickedSecrets.length === 0 && otherSecrets.length === 0 && (
        <EmptyState>No secrets to reveal.</EmptyState>
      )}
      {pickedSecrets.length > 0 && <List>{pickedSecrets.map(renderSecret)}</List>}
      {otherSecrets.length > 0 && (
        <details>
          <summary>Other unrevealed secrets ({otherSecrets.length})</summary>
          <List>{otherSecrets.map(renderSecret)}</List>
        </details>
      )}

      <SectionTitle>Clocks</SectionTitle>
      {campaign.fronts.length === 0 && <EmptyState>No fronts yet.</EmptyState>}
      <CardGrid>
        {campaign.fronts.map((front) => (
          <Card key={front.id}>
            <h3>{front.name}</h3>
            <ProgressClock
              name={front.name}
              segments={front.clockSegments}
              filled={front.clockFilled}
              onChange={(filled) => void saveChild('fronts', { clock_filled: filled }, front.id)}
            />
            {front.portents.find((portent) => !portent.triggered) && (
              <Meta>
                Next portent: {front.portents.find((portent) => !portent.triggered)?.text}
              </Meta>
            )}
          </Card>
        ))}
      </CardGrid>

      <SectionTitle>Quests</SectionTitle>
      {openQuests.length === 0 && <EmptyState>No open quests.</EmptyState>}
      <List>
        {openQuests.map((quest) => {
          const reward = rewardSummary(quest, campaign);
          const encounters = questEncounters(quest, campaign);
          return (
            <li key={quest.id}>
              {quest.name}{' '}
              <Select
                aria-label={`Status of ${quest.name}`}
                value={quest.status}
                style={{ display: 'inline-block', width: 'auto' }}
                onChange={(event) =>
                  void saveChild('quests', { status: event.target.value as QuestStatus }, quest.id)
                }
              >
                {Object.entries(QUEST_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
              {reward && <Meta>Reward: {reward}</Meta>}
              {quest.handouts.length > 0 && (
                <Meta>Handouts: {quest.handouts.map((handout) => handout.name).join(', ')}</Meta>
              )}
              {encounters.length > 0 && (
                <List aria-label={`Encounters for ${quest.name}`}>
                  {encounters.map((encounter) => {
                    const monsterNames = linkGroups(encounter.links, campaign)
                      .monsters.map(nameWithQuantity)
                      .join(', ');
                    const difficulty =
                      encounter.kind === 'combat'
                        ? difficultySummary(encounter.links, quest, campaign)
                        : null;
                    const encounterReward = encounterRewardSummary(encounter, campaign);
                    return (
                      <li key={encounter.id}>
                        {ENCOUNTER_KIND_LABELS[encounter.kind]}: {encounter.name}
                        {monsterNames && ` — ${monsterNames}`}
                        {difficulty && <Meta>{difficulty}</Meta>}
                        {encounterReward && <Meta>Reward: {encounterReward}</Meta>}
                      </li>
                    );
                  })}
                </List>
              )}
            </li>
          );
        })}
      </List>

      <SectionTitle>Quick reference</SectionTitle>
      <CardGrid>
        {npcs.map((npc) => (
          <Card key={npc.id}>
            <h3>{npc.name}</h3>
            <Meta>{NPC_ROLE_LABELS[npc.role]}</Meta>
            {npc.voice && <p>Voice: {npc.voice}</p>}
            {npc.motive && <p>Wants: {npc.motive}</p>}
          </Card>
        ))}
        {session.foundryScenes.length > 0 && (
          <Card>
            <h3>Maps</h3>
            <SceneGallery aria-label="Maps">
              {session.foundryScenes.map((scene) => (
                <li key={scene.uuid}>
                  <SceneThumbnail
                    name={scene.name}
                    url={campaign.sceneThumbnails[scene.uuid]}
                    label={null}
                  />
                </li>
              ))}
            </SceneGallery>
          </Card>
        )}
        {locations.map((location) => (
          <Card key={location.id}>
            <h3>{location.name}</h3>
            {location.foundrySceneUuid && (
              <SceneThumbnail
                name={location.foundrySceneName ?? location.foundrySceneUuid}
                url={campaign.sceneThumbnails[location.foundrySceneUuid]}
              />
            )}
            {location.features.length > 0 && (
              <List>
                {location.features.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </List>
            )}
          </Card>
        ))}
        {bookReferences.length > 0 && (
          <Card>
            <h3>From your books</h3>
            <List>
              {bookReferences.map((reference) => (
                <li key={reference.id}>
                  {reference.name}
                  {(reference.quantity ?? 1) > 1 && <span> ×{reference.quantity}</span>}
                  {reference.detail && <Meta as="span"> ({reference.detail})</Meta>}
                </li>
              ))}
            </List>
          </Card>
        )}
        {(coins || session.treasure) && (
          <Card>
            <h3>Treasure</h3>
            {coins && <p>{coins}</p>}
            {session.treasure && <p>{session.treasure}</p>}
          </Card>
        )}
        {monsters.length > 0 && (
          <Card>
            <h3>Monsters</h3>
            <List>
              {monsters.map((monster) => (
                <li key={monster.id}>
                  <Link to={`/app/${campaign.edition}/monsters/${monster.slug}`}>
                    {monster.name}
                  </Link>
                </li>
              ))}
            </List>
          </Card>
        )}
      </CardGrid>

      <SectionTitle>Session log</SectionTitle>
      <AutosaveField
        label="Session log"
        value={session.log ?? ''}
        rows={8}
        placeholder="What happened? Names you made up, promises, loose ends…"
        onSave={(value) => saveChild('sessions', { log: value || null }, session.id)}
      />

      <SectionTitle>Wrap up</SectionTitle>
      <AutosaveField
        label="Recap"
        value={session.recap ?? ''}
        placeholder="A short recap to read at the start of next session"
        onSave={(value) => saveChild('sessions', { recap: value || null }, session.id)}
      />
      {session.status !== 'played' && (
        <Button
          color={Colors.primary}
          title="Mark session as played"
          onClick={() => void saveChild('sessions', { status: 'played' }, session.id)}
        />
      )}
    </>
  );
};

export default RunView;
