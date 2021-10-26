import React from 'react';
import { Control, FieldErrors, FieldValues, UseFormGetValues, useWatch } from 'react-hook-form';
import { ControlledInput, ControlledSelect } from '../../../../components/forms/ControllerInput';
import { damageTypes, diceOptions } from '../../../../utilities/character-utilities';

const styles = require('./action-form.module.scss');

const AttackForm = (props: {
  actionIndex: number;
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
  getValues: UseFormGetValues<any>;
  handleChange: (data: any, inputName: string, actionIndex: number) => void;
}) => {
  const { control, errors, fieldName, handleChange, actionIndex } = props;

  const handleDiceFormChange = (value) => {
    handleChange(value, `${fieldName}.damage.diceValueOption`, actionIndex);
    handleChange(value.value, `${fieldName}.damage.diceValue`, actionIndex);
  };

  const handleDamageTypeFormChange = (value) => {
    handleChange(value, `${fieldName}.damage.damageTypeOption`, actionIndex);
    handleChange(value.value, `${fieldName}.damage.damageType`, actionIndex);
  };

  const handleInputChange = (value: any, inputName) => {
    handleChange(value, inputName, actionIndex);
  }

  const isRanged = useWatch({
    control,
    name: `${fieldName}.damage.isRanged`
  });

  return (
    <div className={styles.attackWrapper}>
      <div className={styles.subformWrapper}>
        <ControlledInput
          className={styles.actionCol}
          control={control}
          errors={errors}
          fieldName={`${fieldName}.numAttacks`}
          handleChange={handleInputChange}
          label='Number of Attacks'
          min={1}
          type='number'
        />
        <ControlledInput
          className={styles.actionCol}
          control={control}
          errors={errors}
          fieldName={`${fieldName}.damage.numDice`}
          handleChange={handleInputChange}
          label='Dice Count'
          min={1}
          type='number'
        />
        <ControlledSelect
          className={styles.diceSelect}
          handleChange={handleDiceFormChange}
          fieldName={`${fieldName}.damage.diceValueOption`}
          control={control}
          label='Dice Type'
          options={diceOptions}
        />
        <ControlledSelect
          className={styles.diceSelect}
          handleChange={handleDamageTypeFormChange}
          fieldName={`${fieldName}.damage.damageTypeOption`}
          control={control}
          label='Damage Type'
          options={damageTypes}
        />
        <ControlledInput
          className={styles.actionCol}
          control={control}
          errors={errors}
          fieldName={`${fieldName}.damage.numTargets`}
          handleChange={handleInputChange}
          label='Number of Targets'
          min={1}
          type='number'
        />
        {!isRanged && (
          <ControlledInput
            className={styles.actionCol}
            handleChange={handleInputChange}
            fieldName={`${fieldName}.damage.reach`}
            errors={errors}
            control={control}
            label='Reach'
            type='number'
            min={0}
          />
        )}
        <ControlledInput
          className={styles.checkbox}
          handleChange={handleInputChange}
          fieldName={`${fieldName}.damage.isRanged`}
          errors={errors}
          control={control}
          label='Ranged Attack'
          type='checkbox'
        />
      </div>
      {isRanged && (
        <div className={styles.subformWrapper}>
          <ControlledInput
            className={styles.actionCol}
            handleChange={handleInputChange}
            fieldName={`${fieldName}.damage.rangeNormal`}
            errors={errors}
            control={control}
            label='Normal Range'
            type='number'
            min={0}
          />
          <ControlledInput
            className={styles.actionCol}
            handleChange={handleInputChange}
            fieldName={`${fieldName}.damage.rangeLong`}
            errors={errors}
            control={control}
            label='Long Range'
            type='number'
            min={0}
          />
        </div>
      )}
    </div>
  );
};

export default AttackForm;
