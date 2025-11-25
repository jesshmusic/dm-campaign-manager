import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { GiTrashCan } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import {
  ControlledInput,
  ControlledSelect,
} from '../../../../../../components/forms/ControllerInput';
import { senses } from '../../../../../../utilities/character-utilities';

import styles from '../field-array-form.module.scss';

const SenseForm = (props: {
  senseIndex: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { senseIndex, control, errors, fieldName, remove } = props;

  return (
    <div className={styles.formContainer}>
      <ControlledSelect
        className={styles.formElementSelect}
        fieldName={`${fieldName}.${senseIndex}.nameOption`}
        control={control}
        label="Sense"
        options={senses}
      />
      <ControlledInput
        fieldName={`${fieldName}.${senseIndex}.value`}
        errors={errors}
        className={styles.formElementInput}
        control={control}
        label="Value"
      />
      <Button
        type="button"
        onClick={() => remove(senseIndex)}
        color={Colors.danger}
        icon={<GiTrashCan size={30} />}
        hideTitle
        title="Remove Action"
      />
    </div>
  );
};

export default SenseForm;
