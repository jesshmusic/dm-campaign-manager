import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import PageContainer from '../../../containers/PageContainer';
import PageTitle from '../../../components/PageTitle/PageTitle';
import Button from '../../../components/Button/Button';
import { Colors } from '../../../utilities/enums';
import useCampaignApi from '../../campaigns/useCampaignApi';
import useSetupGuide from '../../campaigns/setup/useSetupGuide';
import { SetupGuide, SetupGuideStep, SetupGuideTemplate } from '../../campaigns/setup/setupSteps';
import {
  ButtonRow,
  Card,
  CardGrid,
  Field,
  Input,
  Meta,
  Notice,
  PlannerWrapper,
  SectionTitle,
  TextArea,
  Toolbar,
} from '../../campaigns/Campaigns.styles';

// The server's limits
const MAX_NAME = 60;
const MAX_TEXT = 2000;

type StepWord = 'label' | 'title' | 'intro' | 'why' | 'example';
type TemplateWord = 'title' | 'description' | 'example';

const STEP_FIELDS: { name: StepWord; label: string; hint?: string; long?: boolean }[] = [
  { name: 'label', label: 'Label', hint: 'In the list of steps' },
  { name: 'title', label: 'Title' },
  { name: 'intro', label: 'Intro', long: true },
  { name: 'why', label: 'Why this matters', hint: 'Optional', long: true },
  { name: 'example', label: 'Example', hint: 'Optional', long: true },
];

const TEMPLATE_FIELDS: { name: TemplateWord; label: string; hint?: string; long?: boolean }[] = [
  { name: 'title', label: 'Title' },
  { name: 'description', label: 'Description', long: true },
  { name: 'example', label: 'Example', hint: 'Optional', long: true },
];

// Save and Cancel stay in view on a long page
const SaveBar = styled.div`
  background: ${({ theme }) => theme.colors.cardBg};
  border-top: 1px solid ${({ theme }) => theme.colors.borderColor};
  bottom: 0;
  margin-top: 1rem;
  padding: 0.75rem 0;
  position: sticky;
`;

const same = (a: unknown, b: unknown) => JSON.stringify(a) === JSON.stringify(b);

// A step's why and example can be left out, which the server keeps as null
const optional = (name: StepWord) => name === 'why' || name === 'example';

/**
 * Admins edit the words of the New Campaign guide: each step's label, title,
 * intro, "Why this matters" and example, and each template's title,
 * description and example. The website and the Foundry module both show them.
 * Which steps and templates there are, and their order, is fixed.
 */
const SetupGuidePage = () => {
  const api = useCampaignApi();
  // Skip the browser's cached copy, so an earlier edit isn't saved over
  const load = useCallback(() => api.getSetupGuide(true), [api]);
  const { guide, setGuide, error: loadError, retry } = useSetupGuide(load);
  const [draft, setDraft] = useState<SetupGuide | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => setDraft(guide), [guide]);

  const changedSteps = (current: SetupGuide) =>
    current.steps.filter((step, index) => !same(step, guide?.steps[index]));
  const changedTemplates = (current: SetupGuide) =>
    current.templates.filter((template, index) => !same(template, guide?.templates[index]));
  const dirty =
    draft !== null && (changedSteps(draft).length > 0 || changedTemplates(draft).length > 0);

  const setStep = (index: number, name: StepWord, value: string) => {
    setSaved(false);
    setDraft((current) =>
      current
        ? {
            ...current,
            steps: current.steps.map((step, i) =>
              i === index
                ? { ...step, [name]: optional(name) && value === '' ? null : value }
                : step,
            ),
          }
        : current,
    );
  };

  const setTemplate = (index: number, name: TemplateWord, value: string) => {
    setSaved(false);
    setDraft((current) =>
      current
        ? {
            ...current,
            templates: current.templates.map((template, i) =>
              i === index ? { ...template, [name]: value } : template,
            ),
          }
        : current,
    );
  };

  const save = async () => {
    if (!draft) return;
    setSaving(true);
    setError(null);
    setSaved(false);
    try {
      const updated = await api.updateSetupGuide({
        steps: changedSteps(draft),
        templates: changedTemplates(draft),
      });
      setGuide(updated);
      setSaved(true);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not save the setup guide.');
    } finally {
      setSaving(false);
    }
  };

  const cancel = () => {
    setDraft(guide);
    setError(null);
    setSaved(false);
  };

  const control = (
    id: string,
    field: { label: string; hint?: string; long?: boolean },
    value: string | null,
    onChange: (value: string) => void,
    maxLength: number,
  ) => (
    <Field key={id} htmlFor={id}>
      {field.label}
      {field.hint && <small>{field.hint}</small>}
      {field.long ? (
        <TextArea
          id={id}
          value={value ?? ''}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <Input
          id={id}
          type="text"
          value={value ?? ''}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
        />
      )}
    </Field>
  );

  const renderStep = (step: SetupGuideStep, index: number) => (
    <Card
      as="section"
      key={step.id}
      aria-label={`Step ${index + 1}: ${guide?.steps[index]?.label}`}
    >
      <h3>
        {index + 1}. {guide?.steps[index]?.label}
      </h3>
      {STEP_FIELDS.map((field) =>
        control(
          `step-${step.id}-${field.name}`,
          field,
          step[field.name],
          (value) => setStep(index, field.name, value),
          field.long ? MAX_TEXT : MAX_NAME,
        ),
      )}
    </Card>
  );

  const renderTemplate = (template: SetupGuideTemplate, index: number) => (
    <Card
      as="section"
      key={template.value}
      aria-label={`Template: ${guide?.templates[index]?.title}`}
    >
      <h3>{guide?.templates[index]?.title}</h3>
      {TEMPLATE_FIELDS.map((field) =>
        control(
          `template-${template.value}-${field.name}`,
          field,
          template[field.name],
          (value) => setTemplate(index, field.name, value),
          field.long ? MAX_TEXT : MAX_NAME,
        ),
      )}
    </Card>
  );

  return (
    <PageContainer
      pageTitle="Setup guide"
      description="Edit the words of the New Campaign guide on Dungeon Master Guru and in the Foundry module."
      maxWidth
    >
      <PageTitle title="Setup Guide" />
      <PlannerWrapper>
        <Toolbar>
          <Link to="/app/admin-dashboard">← Admin dashboard</Link>
        </Toolbar>
        <Meta>
          The words of the New Campaign guide, on Dungeon Master Guru and in the Foundry module. The
          steps and templates are fixed; change what they say here.
        </Meta>
        {loadError && (
          <Card role="alert">
            <p>{loadError}</p>
            <ButtonRow>
              <Button color={Colors.primary} title="Retry" onClick={retry} />
            </ButtonRow>
          </Card>
        )}
        {!draft && !loadError && <Meta>Loading the guide…</Meta>}
        {draft && (
          <>
            <SectionTitle>Steps</SectionTitle>
            <CardGrid>{draft.steps.map(renderStep)}</CardGrid>
            <SectionTitle>Templates</SectionTitle>
            <CardGrid>{draft.templates.map(renderTemplate)}</CardGrid>
            <SaveBar>
              {error && <Notice role="alert">{error}</Notice>}
              {saved && (
                <Notice $tone="success" role="status">
                  Saved. The website and the Foundry module show the new words within a few minutes.
                </Notice>
              )}
              <ButtonRow>
                <Button
                  color={Colors.primary}
                  title={saving ? 'Saving…' : 'Save'}
                  disabled={!dirty || saving}
                  onClick={() => void save()}
                />
                <Button
                  color={Colors.secondary}
                  title="Cancel"
                  disabled={!dirty || saving}
                  onClick={cancel}
                />
              </ButtonRow>
            </SaveBar>
          </>
        )}
      </PlannerWrapper>
    </PageContainer>
  );
};

export default SetupGuidePage;
