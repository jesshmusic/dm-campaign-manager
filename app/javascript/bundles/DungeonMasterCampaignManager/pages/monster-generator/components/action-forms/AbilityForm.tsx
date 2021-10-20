import React from 'react';
import ControllerInput from '../../../../components/forms/ControllerInput';
import { Control, Controller, FieldValues } from 'react-hook-form';

const styles = require('./action-form.module.scss');

const AbilityForm = (props: {
  fieldName: string;
  control: Control<FieldValues, object>;
}) => {
  const { fieldName, control } = props;
  return (
    <div className={styles.subformWrapper}>
      <Controller
        render={({ field: { ref, ...rest } }) => (
          <ControllerInput
            type='text'
            label='Description'
            className={styles.actionCol}
            placeholder='Description text...'
            {...rest}
          />
        )}
        name={`${fieldName}.desc`}
        control={control}
      />
    </div>
  );
};

export default AbilityForm;
