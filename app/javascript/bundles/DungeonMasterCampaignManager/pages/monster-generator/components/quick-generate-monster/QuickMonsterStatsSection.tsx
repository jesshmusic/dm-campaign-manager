import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { MonsterQuickGeneratorFormFields, SelectOption } from '../../../../utilities/types';
import MonsterTypeSelect from '../generate-monster/MonsterTypeSelect';
import FormField from '../../../../components/forms/FormField';
import { alignmentOptions, monsterSizeOptions } from '../../../../utilities/character-utilities';
import FormSelect from '../../../../components/forms/FormSelect';
import { raceOptions } from '../../../../components/Widgets/NameOptions';

const styles = require('../generator.module.scss');

const QuickMonsterStatsSection = (props: {
  archetypeOptions: SelectOption[];
  challengeRatingOptions: SelectOption[];
  UseForm: UseFormReturn<MonsterQuickGeneratorFormFields>;
}) => {
  const { archetypeOptions, challengeRatingOptions, UseForm } = props;
  return (
    <>
      <div className={`${styles.threeCol} ${styles.largeInputs}`}>
        <FormSelect
          label="Target Challenge Rating"
          name="challengeRatingOption"
          control={UseForm.control}
          options={challengeRatingOptions}
        />
        <FormField
          label="Armor Class"
          errors={UseForm.formState.errors}
          type="number"
          register={UseForm.register}
          required
          name="armorClass"
        />
        <FormSelect
          label="Archetype"
          name="archetypeOption"
          control={UseForm.control}
          options={archetypeOptions}
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
        <FormSelect
          label="Race (optional)"
          name="characterRace"
          control={UseForm.control}
          options={raceOptions}
        />
      </div>
      <div className={styles.sixCol}>
        <FormField
          label="STR (optional)"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="strength"
        />
        <FormField
          label="DEX (optional)"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="dexterity"
        />
        <FormField
          label="CON (optional)"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          required
          name="constitution"
        />
        <FormField
          label="INT (optional)"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="intelligence"
        />
        <FormField
          label="WIS (optional)"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="wisdom"
        />
        <FormField
          label="CHA (optional)"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="charisma"
        />
      </div>
      <div className={styles.fourCol}>
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
        <FormField
          label="XP"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="xp"
          readOnly
        />
      </div>
    </>
  );
};

export default QuickMonsterStatsSection;
