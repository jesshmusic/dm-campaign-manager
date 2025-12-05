import React from 'react';
import MonsterTypeSelect from '../MonsterTypeSelect';
import FormField from '../../../../../components/forms/FormField';
import FormSelect from '../../../../../components/forms/FormSelect';
import {
  alignmentOptions,
  languageOptions,
  monsterSizeOptions,
} from '../../../../../utilities/character-utilities';
import ChallengeRatingField from '../ChallengeRatingField';
import { FieldValues, UseFormReturn } from 'react-hook-form';
import { raceOptions } from '../../../../../components/Widgets/NameOptions';

import { SixCol, FourCol, FiveCol } from '../../../MonsterGenerator.styles';

const MonsterStatsSection = (props: {
  UseForm: UseFormReturn<FieldValues>;
  handleCalculateCR: () => void;
  isCalculatingCR?: boolean;
  crReasoning?: string | null;
}) => {
  const { UseForm, handleCalculateCR, isCalculatingCR, crReasoning } = props;
  return (
    <>
      <SixCol>
        <MonsterTypeSelect control={UseForm.control} />
        <FormField
          label="Subtype"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          placeholder={'Subtype...'}
          name="monsterSubtype"
        />
        <FormSelect
          label="Alignment"
          name="alignmentOption"
          control={UseForm.control}
          options={alignmentOptions}
        />
        <FormSelect
          label="Size"
          name="size"
          control={UseForm.control}
          options={monsterSizeOptions}
        />
        <FormSelect
          label="Languages"
          name="languages"
          control={UseForm.control}
          options={languageOptions}
          isMulti
        />
        <FormSelect
          label="Race (optional)"
          name="characterRace"
          control={UseForm.control}
          options={raceOptions}
        />
      </SixCol>
      <FourCol>
        <FormField
          label="Armor Class"
          errors={UseForm.formState.errors}
          type="number"
          register={UseForm.register}
          required
          name="armorClass"
        />
        <FormField
          label="Hit Dice Count"
          errors={UseForm.formState.errors}
          type="number"
          register={UseForm.register}
          required
          name="hitDiceNumber"
        />
        <FormField
          label="Attack Bonus"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          required
          name="attackBonus"
        />
        <FormField
          label="Save DC"
          type="number"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          required
          name="saveDC"
        />
      </FourCol>
      <FiveCol>
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
        <ChallengeRatingField
          onCalculateCr={handleCalculateCR}
          register={UseForm.register}
          isCalculating={isCalculatingCR}
          reasoning={crReasoning}
        />
        <FormField
          label="XP"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="xp"
          readOnly
        />
        <FormField
          label="Proficiency Bonus"
          type="text"
          errors={UseForm.formState.errors}
          register={UseForm.register}
          name="profBonus"
          readOnly
        />
      </FiveCol>
    </>
  );
};

export default MonsterStatsSection;
