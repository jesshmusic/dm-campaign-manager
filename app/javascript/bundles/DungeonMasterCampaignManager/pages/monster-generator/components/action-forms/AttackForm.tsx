import React from 'react';
import {
  Control,
  Controller,
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import ControllerInput from '../../../../components/forms/ControllerInput';
import Select from 'react-select';
import { diceOptions } from '../../../../utilities/character-utilities';

const styles = require('./action-form.module.scss');

const AttackForm = (props: {
  fieldName: string;
  control: Control<FieldValues, object>;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
}) => {
  const { control, fieldName, getValues, setValue } = props;
  const handleChange = (value) => {
    const numDice = getValues(`${fieldName}.numAttacks`);
    const diceCount = getValues(`${fieldName}.damage.numDice`);
    const totalDPR = (value.value / 2 + 1) * numDice * diceCount;
    setValue(`${fieldName}.damage.diceValueOption`, value, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue(`${fieldName}.damage.diceValue`, value.value as number, {
      shouldDirty: true,
      shouldTouch: true,
    });
    setValue(`${fieldName}.damage.totalDamagePerRound`, totalDPR, {
      shouldDirty: true,
      shouldTouch: true,
    });
  };

  return (
    <div className={styles.subformWrapper}>
      <Controller
        render={({ field: { ref, ...rest } }) => (
          <ControllerInput
            type="number"
            label="Number of Attacks"
            className={styles.actionCol}
            placeholder="Number of Attacks..."
            {...rest}
          />
        )}
        name={`${fieldName}.numAttacks`}
        control={control}
      />
      <Controller
        render={({ field: { ref, ...rest } }) => (
          <ControllerInput
            type="number"
            label="Dice Count"
            className={styles.actionCol}
            placeholder="Dice Count..."
            {...rest}
          />
        )}
        name={`${fieldName}.damage.numDice`}
        control={control}
      />
      <div className={styles.diceSelect}>
        <label
          htmlFor={`${fieldName}.damage.diceValueOption`}
          className={styles.label}
        >
          Dice Type
        </label>
        <Controller
          render={({ field: { onChange, ...rest } }) => (
            <Select
              className={'reactSelect'}
              classNamePrefix={'reactSelect'}
              options={diceOptions}
              isSearchable
              onChange={handleChange}
              {...rest}
            />
          )}
          name={`${fieldName}.damage.diceValueOption`}
          control={control}
        />
      </div>
    </div>
  );
};

export default AttackForm;
