import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import EntityForm, { toFormValues } from './components/EntityForm';
import { campaignFields } from './campaignFields';
import CompendiumPicker from './components/CompendiumPicker';
import PartyPicker from './components/PartyPicker';
import useLoadedList from './useLoadedList';
import { useCompendiumPacks } from './compendium';
import useCampaignApi from './useCampaignApi';
import { CampaignMode, CampaignTemplate } from './types';
import { Card, Meta, Notice, PlannerWrapper, SectionTitle, Toolbar } from './Campaigns.styles';

export const TEMPLATES: {
  value: CampaignTemplate;
  mode: CampaignMode;
  title: string;
  description: string;
}[] = [
  {
    value: 'three_act',
    mode: 'arc',
    title: 'Story arc',
    description:
      'A set number of sessions, like a six-week campaign. Creates every session with levels rising toward your target, three acts, and a main threat with a clock.',
  },
  {
    value: 'sandbox',
    mode: 'sandbox',
    title: 'Sandbox',
    description:
      'An open-ended campaign driven by quests and villains. Creates a main questline and a villain front; add sessions as you go.',
  },
  {
    value: 'five_room',
    mode: 'oneshot',
    title: 'One-shot',
    description:
      'A single adventure built on the five-room dungeon: guardian, puzzle, setback, climax, reward.',
  },
  {
    value: 'blank',
    mode: 'arc',
    title: 'Blank',
    description: 'Start from scratch.',
  },
];

const TemplateGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
  margin-bottom: 1rem;
`;

const TemplateOption = styled.div<{ $selected: boolean }>`
  background: ${({ theme }) => theme.colors.cardBg};
  border: 2px solid
    ${({ theme, $selected }) => ($selected ? theme.colors.primary : theme.colors.borderColor)};
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 0.75rem;

  label {
    cursor: pointer;
    font-weight: bold;
  }

  input {
    margin-right: 0.5rem;
  }
`;

// The brief, with the compendium picker beside it on wide screens
const Layout = styled.div`
  display: grid;
  gap: 0 1.5rem;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 1100px) {
    align-items: start;
    grid-template-columns: minmax(0, 1fr) 18rem;
  }
`;

const Sidebar = styled.aside`
  @media (min-width: 1100px) {
    position: sticky;
    top: 1rem;
  }
`;

const NewCampaign = () => {
  const api = useCampaignApi();
  const navigate = useNavigate();
  const [template, setTemplate] = useState<CampaignTemplate>('three_act');
  const [error, setError] = useState<string | null>(null);
  const [excludedPacks, setExcludedPacks] = useState<string[]>([]);
  const packs = useCompendiumPacks(api);
  const characters = useLoadedList(api.listPlayerCharacters);
  const [partyIds, setPartyIds] = useState<string[]>([]);
  const fields = campaignFields(api);

  const create = async (attributes: Record<string, unknown>) => {
    setError(null);
    const mode = TEMPLATES.find((option) => option.value === template)?.mode ?? 'arc';
    try {
      const campaign = await api.createCampaign(
        {
          ...attributes,
          mode,
          excluded_compendium_packs: excludedPacks,
          party_character_ids: partyIds,
        },
        template,
      );
      navigate(`/app/campaigns/${campaign.slug}`);
      return true;
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the campaign.');
      return false;
    }
  };

  return (
    <PageContainer pageTitle="New campaign" description="Start a new campaign plan." maxWidth>
      <PageTitle title="New Campaign" />
      <PlannerWrapper>
        <Toolbar>
          <Link to="/app/campaigns">← All campaigns</Link>
        </Toolbar>
        <Layout>
          <div>
            <SectionTitle>What kind of campaign?</SectionTitle>
            <TemplateGrid role="radiogroup" aria-label="Campaign template">
              {TEMPLATES.map((option) => (
                <TemplateOption key={option.value} $selected={template === option.value}>
                  <label>
                    <input
                      type="radio"
                      name="template"
                      value={option.value}
                      checked={template === option.value}
                      aria-describedby={`template-${option.value}-description`}
                      onChange={() => setTemplate(option.value)}
                    />
                    {option.title}
                  </label>
                  <Meta id={`template-${option.value}-description`}>{option.description}</Meta>
                </TemplateOption>
              ))}
            </TemplateGrid>
            <SectionTitle>Who&apos;s playing?</SectionTitle>
            <Card>
              <Meta>
                Pick the player characters in this campaign&apos;s party. Their character sheets
                come from Foundry and stay up to date as they level up.
              </Meta>
              <PartyPicker characters={characters} selected={partyIds} onChange={setPartyIds} />
            </Card>
            <SectionTitle>The brief</SectionTitle>
            <Card>
              {error && <Notice>{error}</Notice>}
              <EntityForm
                fields={fields}
                initialValues={toFormValues(fields, {
                  party_size: 4,
                  start_level: 1,
                })}
                submitLabel="Create campaign"
                onSubmit={create}
              />
            </Card>
          </div>
          <Sidebar aria-label="Compendiums">
            <SectionTitle>Compendiums</SectionTitle>
            <Card>
              <Meta>
                Your Foundry compendiums. Monster and treasure searches in this campaign use the
                checked ones.
              </Meta>
              <CompendiumPicker
                packs={packs}
                excluded={excludedPacks}
                onChange={setExcludedPacks}
              />
            </Card>
          </Sidebar>
        </Layout>
      </PlannerWrapper>
    </PageContainer>
  );
};

export default NewCampaign;
