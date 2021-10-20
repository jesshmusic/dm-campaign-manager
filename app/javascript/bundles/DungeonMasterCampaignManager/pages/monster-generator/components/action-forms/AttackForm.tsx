import React from 'react';
import { Control, Controller, FieldValues } from 'react-hook-form';
import ControllerInput from '../../../../components/forms/ControllerInput';

const styles = require('./action-form.module.scss');

const AttackForm = (props: {
  fieldName: string;
  control: Control<FieldValues, object>;
}) => {
  const { fieldName, control } = props;
  return (
    <div className={styles.subformWrapper}>
      <Controller
        render={({ field: { ref, ...rest } }) => (
          <ControllerInput
            type='number'
            label='Number of Attacks'
            className={styles.actionCol}
            placeholder='Number of Attacks...'
            {...rest}
          />
        )}
        name={`${fieldName}.numAttacks`}
        control={control}
      />
      <div className={styles.diceGroup}>
        <Controller
          render={({ field: { ref, ...rest } }) => (
            <ControllerInput
              type='number'
              label='Dice Count'
              className={styles.actionCol}
              placeholder='Dice Count...'
              {...rest}
            />
          )}
          name={`${fieldName}.damage.numDice`}
          control={control}
        />
        <Controller
          render={({ field: { ref, ...rest } }) => (
            <ControllerInput
              type='number'
              label='Dice Value'
              className={styles.actionCol}
              placeholder='Dice Value...'
              {...rest}
            />
          )}
          name={`${fieldName}.damage.diceValue`}
          control={control}
        />
      </div>
    </div>
  );
};

export default AttackForm;