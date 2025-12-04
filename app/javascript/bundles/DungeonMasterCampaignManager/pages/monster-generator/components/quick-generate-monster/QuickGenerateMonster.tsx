import React from 'react';
import Frame from '../../../../components/Frame/Frame';
import NameFormField from '../NameFormField';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';
import { useData } from './use-data';
import GenMonsterSection from '../generate-monster/sections/GenMonsterSection';
import QuickMonsterStatsSection from './QuickMonsterStatsSection';
import { GiLinkedRings } from 'react-icons/gi';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';
import SavesSkillsSection from '../SavesSkillsSection';

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

const TOTAL_STEPS = 6;

const QuickGenerateMonster = (props: GenerateMonsterProps) => {
  const { isLoading } = props;
  const {
    activeNameButton,
    archetypeOptions,
    challengeRatingOptions,
    getMonsterActions,
    getSpecialAbilities,
    getSpells,
    handleGenerateName,
    handleGenerateMonsterName,
    monsterType,
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
        subtitle="Set the basics and let the generator do the rest. Perfect for creating NPCs and enemies on the fly."
        className="random-monster-generator"
      >
        <StepProgressBar>
          <StepProgressFill $progress={progressPercent} />
        </StepProgressBar>

        <GenForm onSubmit={UseForm.handleSubmit(onSubmit)} noValidate>
          <GenMonsterSection heading="Stats" step={1} currentStep={currentStep} isMultiStep>
            <QuickMonsterStatsSection
              archetypeOptions={archetypeOptions}
              challengeRatingOptions={challengeRatingOptions}
              monsterType={monsterType}
              UseForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Traits" step={2} currentStep={currentStep} isMultiStep>
            <FormSelectAsync
              label="Search for and select special abilities from existing creatures"
              name="specialAbilityOptions"
              control={UseForm.control}
              getOptions={getSpecialAbilities}
              isMulti
              isClearable
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Actions" step={3} currentStep={currentStep} isMultiStep>
            <FormSelectAsync
              label="Search for and select actions from existing creatures"
              name="actionOptions"
              control={UseForm.control}
              getOptions={getMonsterActions}
              isMulti
              isClearable
            />
          </GenMonsterSection>

          <GenMonsterSection
            heading="Saving Throws & Skills"
            step={4}
            currentStep={currentStep}
            isMultiStep
          >
            <SavesSkillsSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Spells" step={5} currentStep={currentStep} isMultiStep>
            <FormSelectAsync
              label={'Spells (search by name, level, or school)'}
              name={`spellOptions`}
              getOptions={getSpells}
              control={UseForm.control}
              isMulti
              isClearable
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Name" step={6} currentStep={currentStep} isMultiStep>
            <NameFormField
              activeNameButton={activeNameButton}
              characterRace={UseForm.getValues('characterRace')?.value}
              handleGenerateName={handleGenerateName}
              handleGenerateMonsterName={handleGenerateMonsterName}
              isGeneratingName={activeNameButton !== null}
              register={UseForm.register}
              monsterType={monsterType}
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
                  title={isLoading ? 'Generating...' : 'Generate NPC'}
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

export default QuickGenerateMonster;
