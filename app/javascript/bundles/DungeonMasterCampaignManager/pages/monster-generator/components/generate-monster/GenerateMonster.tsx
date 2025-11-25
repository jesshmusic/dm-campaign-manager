import React from 'react';
import { ActionVariations } from '../../../../utilities/types';
import Frame from '../../../../components/Frame/Frame';
import NameFormField from '../NameFormField';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
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

import styles from '../generator.module.scss';

export type GenerateMonsterProps = {
  isLoading?: boolean;
  onGenerateMonster: (monsterParams: unknown, token?: string) => void;
  token?: string;
};

const GenerateMonster = (props: GenerateMonsterProps) => {
  const { isLoading } = props;
  const {
    handleCalculateCR,
    handleGenerateName,
    handleGenerateMonsterName,
    onSubmit,
    updateForm,
    UseForm,
  } = useData(props);
  const [testState, setTestState] = React.useState();

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
        title="Monster Creator"
        subtitle="Select options to create a new Monster"
        className="random-monster-generator"
      >
        <form onSubmit={UseForm.handleSubmit(onSubmit)} className={styles.genForm} noValidate>
          <NameFormField
            characterRace={UseForm.getValues('characterRace')?.value}
            handleGenerateName={handleGenerateName}
            handleGenerateMonsterName={handleGenerateMonsterName}
            register={UseForm.register}
            monsterType={UseForm.getValues('monsterType')}
            errors={UseForm.formState.errors}
          />

          <GenMonsterSection heading="Stats">
            <MonsterStatsSection UseForm={UseForm} handleCalculateCR={handleCalculateCR} />
          </GenMonsterSection>

          <GenMonsterSection heading="Ability Scores">
            <AbilitiesSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Saving Throws & Skills">
            <SavesSkillsSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Senses">
            <SensesForm fieldName={'senses'} useForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Speeds">
            <SpeedsForm fieldName={'speeds'} useForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Resistances & Vulnerabilities">
            <ResistancesSection UseForm={UseForm} />
          </GenMonsterSection>

          <GenMonsterSection heading="Actions">
            <BaseActionsFormSection
              actionVariation={ActionVariations.action}
              fieldName="actions"
              singularTitle="Action"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Special Abilities">
            <BaseActionsFormSection
              actionVariation={ActionVariations.specialAbility}
              fieldName="specialAbilities"
              singularTitle="Special Ability"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Reactions">
            <BaseActionsFormSection
              actionVariation={ActionVariations.reaction}
              fieldName="reactions"
              singularTitle="Reaction"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Legendary Actions">
            <BaseActionsFormSection
              actionVariation={ActionVariations.legendaryAction}
              fieldName="legendaryActions"
              singularTitle="Legendary Action"
              useForm={UseForm}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Submit">
            <Button
              color={Colors.success}
              disabled={isLoading}
              title={isLoading ? 'Generating...' : 'Generate Monster'}
              type="submit"
              icon={
                isLoading ? (
                  <GiLinkedRings size={40} className="spinner" />
                ) : (
                  <GiDiceTwentyFacesTwenty size={40} />
                )
              }
              isFullWidth
            />
          </GenMonsterSection>
        </form>
      </Frame>
    </>
  );
};

export default GenerateMonster;
