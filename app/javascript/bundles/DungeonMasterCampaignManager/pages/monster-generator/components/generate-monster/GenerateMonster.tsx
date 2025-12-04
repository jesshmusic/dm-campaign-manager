import React from 'react';
import { ActionVariations } from '../../../../utilities/types';
import Frame from '../../../../components/Frame/Frame';
import NameFormField from '../NameFormField';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';
import { useData } from './use-data';
import BaseActionsFormSection from './sections/actions/action-forms/BaseActionsFormSection';
import GenMonsterSection from './sections/GenMonsterSection';
import MonsterStatsSection from './sections/MonsterStatsSection';
import AbilitiesSection from './sections/AbilitiesSection';
import ResistancesSection from './sections/ResistancesSection';
import SensesForm from './sections/senses/SensesForm';
import SpeedsForm from './sections/speeds/SpeedsForm';
import SavesSkillsSection from '../SavesSkillsSection';
import { GiLinkedRings } from 'react-icons/gi';

import {
  GenForm,
  StepNavigation,
  StepNavigationButtons,
  StepIndicator,
  StepProgressBar,
  StepProgressFill,
} from '../../MonsterGenerator.styles';

export type GenerateMonsterProps = {
  isLoading?: boolean;
  onGenerateMonster: (monsterParams: unknown, token?: string) => void;
  token?: string;
};

const TOTAL_STEPS = 11;

const GenerateMonster = (props: GenerateMonsterProps) => {
  const { isLoading } = props;
  const {
    activeNameButton,
    handleCalculateCR,
    handleGenerateName,
    handleGenerateMonsterName,
    onSubmit,
    updateForm,
    UseForm,
  } = useData(props);
  const [testState, setTestState] = React.useState();
  const [currentStep, setCurrentStep] = React.useState(1);

  const handleNext = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    if (currentStep < TOTAL_STEPS) {
      setCurrentStep(currentStep + 1);
    }
  };

  const progressPercent = (currentStep / TOTAL_STEPS) * 100;

  React.useEffect(() => {
    const subscription = UseForm.watch((value, { name }) => {
      if (name) {
        updateForm(name, value);
      }
      // @ts-expect-error - Type mismatch between form value and test state
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  return (
    <>
      {process.env.NODE_ENV === 'development' ? (
        <pre
          style={{
            position: 'absolute',
            top: '0',
            right: '0',
            backgroundColor: '#fff',
            width: '150px',
            zIndex: 200,
          }}
        >
          {JSON.stringify(testState, null, 2)}
        </pre>
      ) : null}
      <Frame
        subtitle="Full control over every detail. Build custom NPCs and creatures with automatic Challenge Rating calculation."
        className="random-monster-generator"
      >
        <StepProgressBar>
          <StepProgressFill $progress={progressPercent} />
        </StepProgressBar>

        <GenForm onSubmit={UseForm.handleSubmit(onSubmit)} noValidate>
          <GenMonsterSection heading="Stats" step={1} currentStep={currentStep} isMultiStep>
            <MonsterStatsSection UseForm={UseForm} handleCalculateCR={handleCalculateCR} />
          </GenMonsterSection>

          <GenMonsterSection
            heading="Ability Scores"
            step={2}
            currentStep={currentStep}
            isMultiStep
          >
            <AbilitiesSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection
            heading="Saving Throws & Skills"
            step={3}
            currentStep={currentStep}
            isMultiStep
          >
            <SavesSkillsSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Senses" step={4} currentStep={currentStep} isMultiStep>
            <SensesForm fieldName={'senses'} useForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Speeds" step={5} currentStep={currentStep} isMultiStep>
            <SpeedsForm fieldName={'speeds'} useForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection
            heading="Resistances & Vulnerabilities"
            step={6}
            currentStep={currentStep}
            isMultiStep
          >
            <ResistancesSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Actions" step={7} currentStep={currentStep} isMultiStep>
            <BaseActionsFormSection
              actionVariation={ActionVariations.action}
              fieldName="actions"
              singularTitle="Action"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection
            heading="Special Abilities"
            step={8}
            currentStep={currentStep}
            isMultiStep
          >
            <BaseActionsFormSection
              actionVariation={ActionVariations.specialAbility}
              fieldName="specialAbilities"
              singularTitle="Special Ability"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Reactions" step={9} currentStep={currentStep} isMultiStep>
            <BaseActionsFormSection
              actionVariation={ActionVariations.reaction}
              fieldName="reactions"
              singularTitle="Reaction"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection
            heading="Legendary Actions"
            step={10}
            currentStep={currentStep}
            isMultiStep
          >
            <BaseActionsFormSection
              actionVariation={ActionVariations.legendaryAction}
              fieldName="legendaryActions"
              singularTitle="Legendary Action"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Name" step={11} currentStep={currentStep} isMultiStep>
            <NameFormField
              activeNameButton={activeNameButton}
              characterRace={UseForm.getValues('characterRace')?.value}
              handleGenerateName={handleGenerateName}
              handleGenerateMonsterName={handleGenerateMonsterName}
              isGeneratingName={activeNameButton !== null}
              register={UseForm.register}
              monsterType={UseForm.getValues('monsterType')}
              errors={UseForm.formState.errors}
            />
          </GenMonsterSection>

          <StepNavigation>
            <StepIndicator>
              Step {currentStep} of {TOTAL_STEPS}
            </StepIndicator>
            <StepNavigationButtons>
              {currentStep > 1 && (
                <Button
                  color={Colors.secondary}
                  title="Previous"
                  onClick={handlePrevious}
                  type="button"
                />
              )}
              {currentStep < TOTAL_STEPS && (
                <>
                  <Button color={Colors.light} title="Skip" onClick={handleSkip} type="button" />
                  <Button color={Colors.primary} title="Next" onClick={handleNext} type="button" />
                </>
              )}
              {currentStep === TOTAL_STEPS && (
                <Button
                  color={Colors.success}
                  disabled={isLoading}
                  title={isLoading ? 'Creating...' : 'Create NPC'}
                  type="submit"
                  icon={
                    isLoading ? (
                      <GiLinkedRings size={40} className="spinner" />
                    ) : (
                      <GiDiceTwentyFacesTwenty size={40} />
                    )
                  }
                />
              )}
            </StepNavigationButtons>
          </StepNavigation>
        </GenForm>
      </Frame>
    </>
  );
};

export default GenerateMonster;
