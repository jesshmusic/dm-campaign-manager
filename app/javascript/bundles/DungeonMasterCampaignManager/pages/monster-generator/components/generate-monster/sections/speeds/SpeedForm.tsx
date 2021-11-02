import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { GiTrashCan } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import { ControlledInput } from '../../../../../../components/forms/ControllerInput';

const styles = require('../actions/action-forms/action-form.module.scss');

const SpeedForm = (props: {
  speedIndex: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { speedIndex, control, errors, fieldName, remove } = props;

  return (
    <div className={styles.actionContainer}>
      <div className={styles.actionWrapper}>
        <ControlledInput
          fieldName={`${fieldName}.${speedIndex}.name`}
          errors={errors}
          className={styles.actionCol}
          control={control}
          label="Speed"
        />
        <ControlledInput
          fieldName={`${fieldName}.${speedIndex}.value`}
          errors={errors}
          className={styles.actionCol}
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
    </div>
  );
};

export default SpeedForm;
