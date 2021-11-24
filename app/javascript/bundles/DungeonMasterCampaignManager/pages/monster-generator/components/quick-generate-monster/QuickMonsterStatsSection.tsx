import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MonsterQuickGeneratorFormFields, SelectOption } from '../../../../utilities/types';
import MonsterTypeSelect from '../generate-monster/MonsterTypeSelect';
import FormField from '../../../../components/forms/FormField';
import { alignmentOptions, monsterSizeOptions } from '../../../../utilities/character-utilities';
import FormSelect from '../../../../components/forms/FormSelect';

const styles = require('../generator.module.scss');

const QuickMonsterStatsSection = (props: {
  UseForm: UseFormReturn<MonsterQuickGeneratorFormFields>;
  challengeRatingOptions: SelectOption[];
}) => {
  const { UseForm } = props;
  return (
    <>
      <div className={`${styles.twoCol} ${styles.largeInputs}`}>
        <FormSelect
          label="Target Challenge Rating"
          name="challengeRatingOption"
          control={UseForm.control}
          options={props.challengeRatingOptions}
        />
        <FormField
          label="XP"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="xp"
          readOnly
        />
      </div>
      <div className={styles.fiveCol}>
        <MonsterTypeSelect control={UseForm.control} />
        <FormSelect
          label="Alignment"
          name="alignmentOption"
          control={UseForm.control}
          options={alignmentOptions}
        />
        <FormField
          label="Number of Attacks"
          type="number"
          errors={UseForm.formState.errors}
          min={1}
          register={UseForm.register}
          name="numberOfAttacks"
        />
        <FormSelect
          label="Size"
          name="size"
          control={UseForm.control}
          options={monsterSizeOptions}
        />
        <FormField
          label="Spellcaster"
          type="checkbox"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="isCaster"
        />
      </div>
      <div className={styles.fiveCol}>
        <FormField
          label="Armor Class"
          errors={UseForm.formState.errors}
          type="number"
          register={UseForm.register}
          required
          name="armorClass"
        />
        <FormField
          label="CON"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="constitution"
        />
        <FormField
          label="Hit Dice Count"
          errors={UseForm.formState.errors}
          type="number"
          register={UseForm.register}
          required
          name="hitDiceNumber"
          readOnly
        />
        <FormField
          label="Hit Dice Value"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="hitDiceValue"
          readOnly
        />
        <FormField
          label="Hit Points"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="hitPoints"
          readOnly
        />
      </div>
    </>
  );
};

export default QuickMonsterStatsSection;
