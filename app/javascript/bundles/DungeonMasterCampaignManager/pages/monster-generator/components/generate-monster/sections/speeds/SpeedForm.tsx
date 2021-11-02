import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { GiTrashCan } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import {
  ControlledInput,
  ControlledSelect,
} from '../../../../../../components/forms/ControllerInput';
import { speeds } from '../../../../../../utilities/character-utilities';

const styles = require('../field-array-form.module.scss');

const SpeedForm = (props: {
  speedIndex: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { speedIndex, control, errors, fieldName, remove } = props;

  return (
    <div className={styles.formContainer}>
      <ControlledSelect
        className={styles.formElementSelect}
        fieldName={`${fieldName}.${speedIndex}.nameOption`}
        control={control}
        label="Speed"
        options={speeds}
      />
      <ControlledInput
        fieldName={`${fieldName}.${speedIndex}.value`}
        errors={errors}
        className={styles.formElementInput}
        control={control}
        label="Value"
      />
      <Button
        type="button"
        onClick={() => remove(speedIndex)}
        color={Colors.danger}
        icon={<GiTrashCan size={30} />}
        hideTitle
        title="Remove Action"
      />
    </div>
  );
};

export default SpeedForm;
