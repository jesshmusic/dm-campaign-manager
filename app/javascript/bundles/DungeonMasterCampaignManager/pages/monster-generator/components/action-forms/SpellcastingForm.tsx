import React from 'react';
import {
  ControlledInput,
  ControllerInput,
} from '../../../../components/forms/ControllerInput';
import { Control, Controller, FieldErrors, FieldValues } from 'react-hook-form';
import axios, { AxiosResponse } from 'axios';
import { filterOptionsWithData } from '../../../../utilities/character-utilities';
import FormSelect from '../../../../components/forms/FormSelect';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';

const styles = require('./action-form.module.scss');

export const abilityOptions = [
  { label: 'Charisma', value: 'charisma' },
  { label: 'Constitution', value: 'constitution' },
  { label: 'Dexterity', value: 'dexterity' },
  { label: 'Intelligence', value: 'intelligence' },
  { label: 'Strength', value: 'strength' },
  { label: 'Wisdom', value: 'wisdom' },
];

const slotNames = [
  'first',
  'second',
  'third',
  'fourth',
  'fifth',
  'sixth',
  'seventh',
  'eighth',
  'ninth',
];

const SpellcastingForm = (props: {
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
}) => {
  const { fieldName, errors, control } = props;

  const getSpells = (inputValue: string, callback: any) => {
    axios
      .get(`/v1/spells.json?list=true&search=${inputValue}`)
      .then((response: AxiosResponse<any>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((error) => {});
  };

  return (
    <div className={styles.spellsForm}>
      <h5>Spellcasting</h5>
      <div className={styles.subformWrapper}>
        <Controller
          render={({ field: { ref, ...rest } }) => (
            <ControllerInput
              type="number"
              label="Spellcasting Level"
              className={styles.actionCol}
              errors={errors}
              {...rest}
            />
          )}
          name={`${fieldName}.spellCasting.level`}
          control={control}
        />
        <FormSelect
          className={styles.actionCol}
          label={'Spellcasting Ability'}
          name={`${fieldName}.spellCasting.abilityOption`}
          control={control}
          defaultValue={abilityOptions[3]}
          options={abilityOptions}
        />
      </div>
      <div className={styles.spellSlots}>
        {slotNames.map((slotName, index) => (
          <ControlledInput
            key={`${fieldName}.spellCasting.slots.${slotName}${index}`}
            fieldName={`${fieldName}.spellCasting.slots.${slotName}`}
            errors={errors}
            control={control}
            type="number"
            label={(index + 1).toString()}
          />
        ))}
      </div>
      <div className={styles.subformWrapper}>
        <FormSelectAsync
          className={styles.actionCol}
          label={'Spells'}
          name={`${fieldName}.spellCasting.spellOptions`}
          getOptions={getSpells}
          control={control}
          menuPlacement="top"
          isMulti
          isClearable
        />
      </div>
    </div>
  );
};

export default SpellcastingForm;
