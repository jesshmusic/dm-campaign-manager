import React from 'react';
import { ActionVariations, MonsterProps } from '../../../../utilities/types';
import Frame from '../../../../components/Frame/Frame';
import NameFormField from '../NameFormField';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';
import { useData } from '../use-data';
import BaseActionsFormSection from './actions/action-forms/BaseActionsFormSection';
import GenMonsterSection from './sections/GenMonsterSection';
import MonsterStatsSection from './sections/MonsterStatsSection';
import AbilitiesSection from './sections/AbilitiesSection';
import ResistancesSection from './sections/ResistancesSection';

const styles = require('../generator.module.scss');

export type GenerateMonsterProps = {
  setMonster: (monster: MonsterProps) => void;
};

const GenerateMonster = (props: GenerateMonsterProps) => {
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
      // @ts-ignore
      setTestState(value);
    });
    return () => subscription.unsubscribe();
  }, [UseForm.watch]);

  return (
    <>
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
      <Frame
        title="Random Monster Generator"
        subtitle="Select options to create a new Monster"
        className="random-monster-generator"
      >
        <form
          onSubmit={UseForm.handleSubmit(onSubmit)}
          className={styles.genForm}
          noValidate
        >
          <NameFormField
            handleGenerateName={handleGenerateName}
            handleGenerateMonsterName={handleGenerateMonsterName}
            register={UseForm.register}
            monsterType={UseForm.getValues('monsterType')}
            errors={UseForm.formState.errors}
          />

          <GenMonsterSection heading="Stats">
            <MonsterStatsSection
              UseForm={UseForm}
              handleCalculateCR={handleCalculateCR}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Ability Scores">
            <AbilitiesSection UseForm={UseForm} />
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

          <div>
            <div className="btn-group" aria-label="Character actions">
              <Button
                color={Colors.success}
                title="Generate Monster"
                type="submit"
                icon={<GiDiceTwentyFacesTwenty size={30} />}
              />
            </div>
          </div>
        </form>
      </Frame>
    </>
  );
};

export default GenerateMonster;
