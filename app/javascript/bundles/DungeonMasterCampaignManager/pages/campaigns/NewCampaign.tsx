import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import PageContainer from '../../containers/PageContainer';
import PageTitle from '../../components/PageTitle/PageTitle';
import Button from '../../components/Button/Button';
import { Colors } from '../../utilities/enums';
import { FieldConfig, toAttributes, toFormValues } from './components/EntityForm';
import FormFields from './components/FormFields';
import CompendiumPicker from './components/CompendiumPicker';
import LearnMore from './components/LearnMore';
import PartyPicker from './components/PartyPicker';
import { campaignFields } from './campaignFields';
import { useCompendiumPacks } from './compendium';
import useCampaignApi from './useCampaignApi';
import useLoadedList from './useLoadedList';
import { buildSetup, SETUP_STEP_IDS, SetupStepId, TEMPLATE_MODES } from './setup/setupSteps';
import useSetupDraft from './setup/useSetupDraft';
import useSetupGuide from './setup/useSetupGuide';
import { SETUP_STEP_CREDITS, TEMPLATE_CREDITS } from './techniques';
import {
  ButtonRow,
  Card,
  LinkButton,
  Meta,
  Notice,
  PlannerWrapper,
  SectionTitle,
  Toolbar,
} from './Campaigns.styles';

const REVIEW_STEP = SETUP_STEP_IDS.length - 1;
// The truths everyone at the table knows; the server allows six
const MAX_TRUTHS = 6;

const Progress = styled.ol`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
  margin: 0 0 1rem;
  padding: 0;

  button {
    background: ${({ theme }) => theme.colors.cardBg};
    border: 1px solid ${({ theme }) => theme.colors.borderColor};
    border-radius: 999px;
    color: inherit;
    cursor: pointer;
    font: inherit;
    padding: 0.25rem 0.75rem;
  }

  button[aria-current='step'] {
    border-color: ${({ theme }) => theme.colors.primary};
    font-weight: bold;
  }

  button:disabled {
    cursor: default;
    opacity: 0.5;
  }
`;

// The step, with "why this matters" beside it on wide screens
const Layout = styled.div`
  display: grid;
  gap: 0 1.5rem;
  grid-template-columns: minmax(0, 1fr);

  @media (min-width: 1100px) {
    align-items: start;
    grid-template-columns: minmax(0, 1fr) 18rem;
  }
`;

const Aside = styled.aside`
  h3 {
    margin-top: 0;
  }

  h4 {
    font-size: ${({ theme }) => theme.fontSizes.base};
    margin: 0.75rem 0 0.25rem;
  }
`;

const Example = styled.p`
  font-style: italic;
  white-space: pre-wrap;
`;

const Heading = styled(SectionTitle)`
  &:focus {
    outline: none;
  }
`;

const TemplateGrid = styled.div`
  display: grid;
  gap: 0.75rem;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 14rem), 1fr));
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

const SummaryBlock = styled.section`
  border-bottom: 1px solid ${({ theme }) => theme.colors.borderColor};
  padding: 0.5rem 0;

  h3 {
    margin: 0;
  }

  p {
    margin: 0.25rem 0;
  }
`;

const SummaryHeader = styled.div`
  align-items: baseline;
  display: flex;
  justify-content: space-between;
`;

const Fact = ({ label, value }: { label: string; value?: React.ReactNode }) =>
  value ? (
    <p>
      <strong>{label}:</strong> {value}
    </p>
  ) : null;

// The page around the guide, also shown while its words load
const Page = ({ children }: { children: React.ReactNode }) => (
  <PageContainer pageTitle="New campaign" description="Start a new campaign plan." maxWidth>
    <PageTitle title="New Campaign" />
    <PlannerWrapper>
      <Toolbar>
        <Link to="/app/campaigns">← All campaigns</Link>
      </Toolbar>
      {children}
    </PlannerWrapper>
  </PageContainer>
);

/**
 * A step-by-step guide to starting a campaign: what kind of game, the pitch,
 * the table, the world and the books, then a review. Creating it opens the
 * new campaign. The guide's words come from the server (see setupSteps).
 */
const NewCampaign = () => {
  const api = useCampaignApi();
  const navigate = useNavigate();
  const fields = campaignFields(api);
  const packs = useCompendiumPacks(api);
  const characters = useLoadedList(api.listPlayerCharacters);
  const { guide, error: guideError, retry } = useSetupGuide(api.getSetupGuide);
  const setup = useMemo(() => (guide ? buildSetup(guide) : null), [guide]);
  const { draft, update, clear, restored } = useSetupDraft(
    () => ({
      step: 0,
      furthest: 0,
      template: 'three_act',
      values: toFormValues(fields, { party_size: 4, start_level: 1 }),
      partyIds: [],
      excludedPacks: [],
      partySizeEdited: false,
    }),
    REVIEW_STEP,
  );
  const [showRestored, setShowRestored] = useState(restored);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Move to the new step's heading, but not when the page first opens
  const headingRef = useRef<HTMLHeadingElement>(null);
  const opened = useRef(false);
  useEffect(() => {
    if (!opened.current) {
      opened.current = true;
      return;
    }
    headingRef.current?.focus();
    headingRef.current?.scrollIntoView?.({ block: 'start' });
  }, [draft.step]);

  if (!setup) {
    const problem = guideError ?? (guide ? 'The setup guide is missing some of its steps.' : null);
    return (
      <Page>
        {problem ? (
          <Card role="alert">
            <p>{problem}</p>
            <ButtonRow>
              <Button color={Colors.primary} title="Retry" onClick={retry} />
            </ButtonRow>
          </Card>
        ) : (
          <Meta>Loading the guide…</Meta>
        )}
      </Page>
    );
  }

  const { steps, templates } = setup;
  const step = steps[draft.step];
  const stepIndex = (id: SetupStepId) => steps.findIndex((s) => s.id === id);
  const fieldsFor = (names: string[] = []) =>
    names
      .map((name) => fields.find((field) => field.name === name))
      .filter((field): field is FieldConfig => Boolean(field));
  const text = (name: string) => String(draft.values[name] ?? '').trim();
  const named = text('name') !== '';

  const goTo = (index: number) => {
    setError(null);
    update({ step: index, furthest: Math.max(draft.furthest, index) });
  };

  const truthCount = text('truths')
    .split('\n')
    .filter((truth) => truth.trim()).length;

  const next = () => {
    if (step.id === 'pitch' && !named) {
      setError('Give your campaign a name to go on.');
      return;
    }
    if (step.id === 'world' && truthCount > MAX_TRUTHS) {
      setError(`Keep it to ${MAX_TRUTHS} truths. You have ${truthCount}.`);
      return;
    }
    goTo(draft.step + 1);
  };

  const setValue = (name: string, value: string | boolean) =>
    update({
      values: { ...draft.values, [name]: value },
      partySizeEdited: draft.partySizeEdited || name === 'party_size',
    });

  // Picking characters sets the number of players, until the DM types their own
  const setParty = (ids: string[]) =>
    update({
      partyIds: ids,
      values:
        !draft.partySizeEdited && ids.length > 0
          ? { ...draft.values, party_size: String(ids.length) }
          : draft.values,
    });

  const startOver = () => {
    clear();
    setShowRestored(false);
    setError(null);
  };

  const create = async () => {
    if (!named) {
      setError('Give your campaign a name before creating it.');
      return;
    }
    setCreating(true);
    setError(null);
    const mode = TEMPLATE_MODES[draft.template] ?? 'arc';
    try {
      const campaign = await api.createCampaign(
        {
          ...toAttributes(fields, draft.values),
          mode,
          excluded_compendium_packs: draft.excludedPacks,
          party_character_ids: draft.partyIds,
        },
        draft.template,
      );
      clear();
      navigate(`/app/campaigns/${campaign.slug}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the campaign.');
    } finally {
      setCreating(false);
    }
  };

  const renderKind = () => (
    <TemplateGrid role="radiogroup" aria-label="Campaign template">
      {templates.map((option) => (
        <TemplateOption key={option.value} $selected={draft.template === option.value}>
          <label>
            <input
              type="radio"
              name="template"
              value={option.value}
              checked={draft.template === option.value}
              aria-describedby={`template-${option.value}-description`}
              onChange={() => update({ template: option.value })}
            />
            {option.title}
          </label>
          <Meta id={`template-${option.value}-description`}>{option.description}</Meta>
          {option.example && (
            <Meta>
              <em>{option.example}</em>
            </Meta>
          )}
          <LearnMore credits={TEMPLATE_CREDITS[option.value] ?? []} />
        </TemplateOption>
      ))}
    </TemplateGrid>
  );

  const renderTable = () => (
    <>
      <h3>Who&apos;s playing?</h3>
      <Meta>
        Pick the player characters in the party. Their character sheets come from Foundry and stay
        up to date as they level up.
      </Meta>
      <PartyPicker characters={characters} selected={draft.partyIds} onChange={setParty} />
      <FormFields fields={fieldsFor(step.fields)} values={draft.values} onChange={setValue} />
    </>
  );

  const renderReview = () => {
    const template = templates.find((option) => option.value === draft.template);
    const start = text('start_level');
    const target = text('target_level');
    const levelOnly = start !== '' ? start : target;
    const party = (characters ?? []).filter((character) => draft.partyIds.includes(character.id));
    const truths = text('truths')
      .split('\n')
      .map((truth) => truth.trim())
      .filter(Boolean);
    const onPacks = (packs ?? []).filter((pack) => !draft.excludedPacks.includes(pack.pack));
    const summary = (id: SetupStepId, children: React.ReactNode) => (
      <SummaryBlock key={id}>
        <SummaryHeader>
          <h3>{steps[stepIndex(id)].title}</h3>
          <LinkButton
            type="button"
            aria-label={`Edit ${steps[stepIndex(id)].title.toLowerCase()}`}
            onClick={() => goTo(stepIndex(id))}
          >
            Edit
          </LinkButton>
        </SummaryHeader>
        {children}
      </SummaryBlock>
    );
    return (
      <>
        {summary('kind', <p>{template?.title}</p>)}
        {summary(
          'pitch',
          <>
            <Fact label="Name" value={text('name') || <em>Not named yet</em>} />
            <Fact label="Premise" value={text('premise')} />
            <Fact label="Tone" value={text('tone')} />
            <Fact label="Pitch for your players" value={text('pitch')} />
          </>,
        )}
        {summary(
          'table',
          <>
            <Fact
              label="Party"
              value={party.map((character) => character.name).join(', ') || undefined}
            />
            <Fact label="Players" value={text('party_size')} />
            <Fact
              label="Levels"
              value={start && target && target !== start ? `${start} to ${target}` : levelOnly}
            />
            <Fact label="Sessions" value={text('planned_sessions')} />
            <Fact label="How often" value={text('cadence')} />
          </>,
        )}
        {summary(
          'world',
          <>
            <Fact label="Setting" value={text('setting_name')} />
            {truths.length > 0 && (
              <ul aria-label="Truths of the setting">
                {truths.map((truth) => (
                  <li key={truth}>{truth}</li>
                ))}
              </ul>
            )}
            <Fact label="Setting notes" value={text('setting_notes')} />
            {!text('setting_name') && truths.length === 0 && !text('setting_notes') && (
              <Meta>Nothing yet. You can add it later.</Meta>
            )}
          </>,
        )}
        {summary(
          'books',
          <p>
            {!packs || packs.length === 0
              ? 'No Foundry compendiums yet.'
              : onPacks.length === packs.length
                ? 'All compendiums'
                : `${onPacks.length} of ${packs.length} compendiums`}
          </p>,
        )}
      </>
    );
  };

  const renderStep = () => {
    switch (step.id) {
      case 'kind':
        return renderKind();
      case 'table':
        return renderTable();
      case 'books':
        return (
          <CompendiumPicker
            packs={packs}
            excluded={draft.excludedPacks}
            onChange={(excludedPacks) => update({ excludedPacks })}
          />
        );
      case 'review':
        return renderReview();
      default:
        return (
          <FormFields fields={fieldsFor(step.fields)} values={draft.values} onChange={setValue} />
        );
    }
  };

  return (
    <Page>
      {showRestored && (
        <Notice $tone="success">
          Picking up where you left off.{' '}
          <LinkButton type="button" onClick={startOver}>
            Start over
          </LinkButton>
        </Notice>
      )}
      <nav aria-label="Setup steps">
        <Progress>
          {steps.map((s, index) => (
            <li key={s.id}>
              <button
                type="button"
                aria-current={index === draft.step ? 'step' : undefined}
                disabled={index > draft.furthest}
                onClick={() => goTo(index)}
              >
                {index + 1}. {s.label}
              </button>
            </li>
          ))}
        </Progress>
      </nav>
      <Layout>
        <div>
          <Heading ref={headingRef} tabIndex={-1}>
            {step.title}
          </Heading>
          <Meta>{step.intro}</Meta>
          <LearnMore credits={SETUP_STEP_CREDITS[step.id] ?? []} />
          <Card>
            {renderStep()}
            {error && <Notice>{error}</Notice>}
            <ButtonRow>
              {draft.step > 0 && (
                <Button
                  color={Colors.secondary}
                  title="Back"
                  onClick={() => goTo(draft.step - 1)}
                />
              )}
              {draft.step < REVIEW_STEP ? (
                <Button
                  color={Colors.primary}
                  title={`Next: ${steps[draft.step + 1].title}`}
                  onClick={next}
                />
              ) : (
                <Button
                  color={Colors.primary}
                  title={creating ? 'Creating…' : 'Create campaign'}
                  disabled={creating}
                  onClick={() => void create()}
                />
              )}
            </ButtonRow>
          </Card>
        </div>
        {(step.why ?? step.example) && (
          <Aside aria-label="Why this matters">
            <Card>
              <h3>Why this matters</h3>
              {step.why && <p>{step.why}</p>}
              {step.example && (
                <>
                  <h4>Example</h4>
                  <Example>{step.example}</Example>
                </>
              )}
            </Card>
          </Aside>
        )}
      </Layout>
    </Page>
  );
};

export default NewCampaign;
