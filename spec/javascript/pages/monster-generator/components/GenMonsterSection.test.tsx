import React from 'react';
import { render, screen } from '../../../test-utils';
import GenMonsterSection from '../../../../../app/javascript/bundles/DungeonMasterCampaignManager/pages/monster-generator/components/GenMonsterSection';

describe('GenMonsterSection', () => {
  it('renders without crashing', () => {
    render(
      <GenMonsterSection heading="Test Section">
        <p>Test content</p>
      </GenMonsterSection>
    );
    expect(screen.getByText('Test Section')).toBeInTheDocument();
  });

  it('renders heading without step number when step is not provided', () => {
    render(
      <GenMonsterSection heading="Basic Section">
        <p>Content</p>
      </GenMonsterSection>
    );
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Basic Section');
  });

  it('renders heading with step number when step is provided but not multi-step', () => {
    render(
      <GenMonsterSection heading="Step Section" step={1}>
        <p>Content</p>
      </GenMonsterSection>
    );
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Step 1: Step Section');
  });

  it('renders children content', () => {
    render(
      <GenMonsterSection heading="Test">
        <span data-testid="child-content">Child Content</span>
      </GenMonsterSection>
    );
    expect(screen.getByTestId('child-content')).toBeInTheDocument();
  });

  it('renders in multi-step mode with visible container when current step matches', () => {
    render(
      <GenMonsterSection heading="Multi Step" step={2} currentStep={2} isMultiStep={true}>
        <p>Visible content</p>
      </GenMonsterSection>
    );
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Step 2: Multi Step');
    expect(screen.getByText('Visible content')).toBeInTheDocument();
  });

  it('renders in multi-step mode when current step does not match (hidden)', () => {
    render(
      <GenMonsterSection heading="Hidden Step" step={3} currentStep={1} isMultiStep={true}>
        <p>Hidden content</p>
      </GenMonsterSection>
    );
    // Content is still in DOM but container has visibility styling (hidden from accessibility tree)
    expect(screen.getByRole('heading', { level: 4, hidden: true })).toHaveTextContent('Step 3: Hidden Step');
    expect(screen.getByText('Hidden content', { exact: false })).toBeInTheDocument();
  });

  it('renders without multi-step container when isMultiStep is false', () => {
    render(
      <GenMonsterSection heading="Regular Section" step={1} isMultiStep={false}>
        <p>Regular content</p>
      </GenMonsterSection>
    );
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Step 1: Regular Section');
    expect(screen.getByText('Regular content')).toBeInTheDocument();
  });

  it('renders without step number when isMultiStep is true but step is undefined', () => {
    render(
      <GenMonsterSection heading="No Step" isMultiStep={true} currentStep={1}>
        <p>Content without step</p>
      </GenMonsterSection>
    );
    // Falls through to non-StepContainer branch because step is falsy
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('No Step');
    expect(screen.getByText('Content without step')).toBeInTheDocument();
  });

  it('renders heading without step prefix when step is 0', () => {
    render(
      <GenMonsterSection heading="Zero Step" step={0}>
        <p>Content</p>
      </GenMonsterSection>
    );
    // step 0 is falsy, so no step prefix
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('Zero Step');
  });

  it('handles undefined currentStep in multi-step mode', () => {
    render(
      <GenMonsterSection heading="Multi Step" step={1} isMultiStep={true}>
        <p>Test content</p>
      </GenMonsterSection>
    );
    // currentStep is undefined, so currentStep === step is false, but content still renders
    expect(screen.getByRole('heading', { level: 4, hidden: true })).toHaveTextContent('Step 1: Multi Step');
  });
});
