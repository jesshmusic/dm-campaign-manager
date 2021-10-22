import React from 'react';
import {
  Control,
  Controller,
  FieldErrors,
  FieldValues,
  UseFormGetValues,
  UseFormSetValue,
  useWatch,
} from 'react-hook-form';
import ControllerInput from '../../../../components/forms/ControllerInput';
import Select from 'react-select';
import { diceOptions } from '../../../../utilities/character-utilities';

const styles = require('./action-form.module.scss');

const AttackForm = (props: {
  fieldName: string;
  errors: FieldErrors;
  control: Control<FieldValues, object>;
  getValues: UseFormGetValues<any>;
  handleChange: (data: any, fieldName: string) => void;
  setValue: UseFormSetValue<any>;
}) => {
  const { control, errors, fieldName, handleChange, setValue } = props;
  const handleFormChange = (value) => {
    handleChange(value, `${fieldName}.damage.diceValueOption`);
    handleChange(value.value, `${fieldName}.damage.diceValue`);
  };

  const isRanged = useWatch({
    control,
    name: `${fieldName}.damage.isRanged`,
    defaultValue: false,
  });

  return (
    <div className={styles.attackWrapper}>
      <div className={styles.subformWrapper}>
        <Controller
          render={({ field: { ref, onChange, ...rest } }) => (
            <ControllerInput
              type="number"
              label="Number of Attacks"
              className={styles.actionCol}
              onChange={(event) =>
                handleChange(event.target.value, `${fieldName}.numAttacks`)
              }
              placeholder="Number of Attacks..."
              errors={errors}
              min={1}
              {...rest}
            />
          )}
          name={`${fieldName}.numAttacks`}
          control={control}
        />
        <Controller
          render={({ field: { ref, onChange, ...rest } }) => (
            <ControllerInput
              type="number"
              label="Dice Count"
              className={styles.actionCol}
              onChange={(event) =>
                handleChange(event.target.value, `${fieldName}.damage.numDice`)
              }
              placeholder="Dice Count..."
              errors={errors}
              min={1}
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
                onChange={handleFormChange}
                {...rest}
              />
            )}
            name={`${fieldName}.damage.diceValueOption`}
            control={control}
          />
        </div>
        <Controller
          render={({ field: { ref, onChange, ...rest } }) => (
            <ControllerInput
              type="checkbox"
              label="Ranged Attack"
              className={styles.checkbox}
              onChange={(event) =>
                handleChange(
                  event.target.checked,
                  `${fieldName}.damage.isRanged`
                )
              }
              errors={errors}
              {...rest}
            />
          )}
          name={`${fieldName}.damage.isRanged`}
          control={control}
        />
      </div>
      {isRanged && (
        <div className={styles.subformWrapper}>
          <Controller
            render={({ field: { ref, onChange, ...rest } }) => (
              <ControllerInput
                type="number"
                label="Normal Range"
                className={styles.actionCol}
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    `${fieldName}.damage.rangeNormal`
                  )
                }
                placeholder="Normal Range..."
                errors={errors}
                min={0}
                {...rest}
              />
            )}
            name={`${fieldName}.damage.rangeNormal`}
            control={control}
          />
          <Controller
            render={({ field: { ref, onChange, ...rest } }) => (
              <ControllerInput
                type="number"
                label="Long Range"
                className={styles.actionCol}
                onChange={(event) =>
                  handleChange(
                    event.target.value,
                    `${fieldName}.damage.rangeLong`
                  )
                }
                placeholder="Long Range..."
                errors={errors}
                min={0}
                {...rest}
              />
            )}
            name={`${fieldName}.damage.rangeLong`}
            control={control}
          />
        </div>
      )}
    </div>
  );
};

export default AttackForm;
