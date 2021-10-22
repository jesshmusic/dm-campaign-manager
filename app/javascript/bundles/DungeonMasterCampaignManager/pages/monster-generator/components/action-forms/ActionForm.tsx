import React from 'react';
import {
  Control,
  Controller,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';
import ControllerInput from '../../../../components/forms/ControllerInput';
import Select from 'react-select';
import Button from '../../../../components/Button/Button';
import { Colors } from '../../../../utilities/enums';
import { GiTrashCan } from 'react-icons/gi';
import AbilityForm from './AbilityForm';
import { ActionTypes } from './ActionsForm';
import AttackForm from './AttackForm';

const styles = require('./action-form.module.scss');
const inputStyles = require('../../../../components/forms/input.module.scss');

const ActionForm = (props: {
  actionIndex: number;
  control: Control;
  remove: (index?: number | number[] | undefined) => void;
  getValues: UseFormGetValues<any>;
  setValue: UseFormSetValue<any>;
}) => {
  const [actionFormState, setActionFormState] = React.useState(
    ActionTypes.attack
  );
  const { actionIndex, control, getValues, remove, setValue } = props;

  const handleChange = (data) => {
    setActionFormState(data.value);
    setValue(`actions.${actionIndex}.attackType`, data);
  };

  return (
    <div className={styles.actionContainer}>
      <div className={styles.actionWrapper}>
        <Controller
          render={({ field: { ref, ...rest } }) => (
            <ControllerInput
              label="Name"
              {...rest}
              type="text"
              placeholder="Action Title..."
              className={styles.actionCol}
            />
          )}
          name={`actions.${actionIndex}.name`}
          control={control}
        />
        <Controller
          render={({ field }) => (
            <div className={`${inputStyles.wrapper} ${styles.actionCol}`}>
              <label className={inputStyles.label}>Action Type</label>
              <Select
                className={inputStyles.selectStyle}
                classNamePrefix={'reactSelect'}
                {...field}
                defaultValue={{ value: 'ability', label: 'Ability' }}
                isSearchable={false}
                onChange={handleChange}
                options={[
                  { value: ActionTypes.ability, label: 'Ability' },
                  { value: ActionTypes.attack, label: 'Attack' },
                  {
                    value: ActionTypes.spellCasting,
                    label: 'Spell Casting',
                  },
                ]}
              />
            </div>
          )}
          name={`actions.${actionIndex}.attackType`}
          control={control}
        />
        <Button
          type="button"
          onClick={() => remove(actionIndex)}
          color={Colors.danger}
          icon={<GiTrashCan size={30} />}
          hideTitle
          title="Remove Action"
        />
      </div>
      {actionFormState === ActionTypes.ability && (
        <AbilityForm fieldName={`actions.${actionIndex}`} control={control} />
      )}
      {actionFormState === ActionTypes.attack && (
        <AttackForm
          fieldName={`actions.${actionIndex}`}
          getValues={getValues}
          control={control}
          setValue={setValue}
        />
      )}
    </div>
  );
};

export default ActionForm;
