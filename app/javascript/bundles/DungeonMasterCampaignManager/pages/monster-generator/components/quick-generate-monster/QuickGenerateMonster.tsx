import React from 'react';
import Frame from '../../../../components/Frame/Frame';
import NameFormField from '../NameFormField';
import { GiDiceTwentyFacesTwenty } from 'react-icons/gi/';
import { Colors } from '../../../../utilities/enums';
import Button from '../../../../components/Button/Button';
import { useData } from './use-data';
import GenMonsterSection from '../generate-monster/sections/GenMonsterSection';
import QuickMonsterStatsSection from './QuickMonsterStatsSection';

const styles = require('../generator.module.scss');

export type GenerateMonsterProps = {
  onGenerateMonster: (monsterParams: any, token?: string) => void;
  token?: string;
};

const QuickGenerateMonster = (props: GenerateMonsterProps) => {
  const {
    challengeRatingOptions,
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
            <QuickMonsterStatsSection
              UseForm={UseForm}
              challengeRatingOptions={challengeRatingOptions}
            />
          </GenMonsterSection>

          <GenMonsterSection heading="Submit">
            <Button
              color={Colors.success}
              title="Generate Monster"
              type="submit"
              icon={<GiDiceTwentyFacesTwenty size={40} />}
              isFullWidth
            />
          </GenMonsterSection>
        </form>
      </Frame>
    </>
  );
};

export default QuickGenerateMonster;
