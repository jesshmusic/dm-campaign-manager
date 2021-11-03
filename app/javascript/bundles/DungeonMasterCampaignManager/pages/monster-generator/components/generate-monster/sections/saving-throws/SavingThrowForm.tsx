import React from 'react';
import { Control, FieldErrors } from 'react-hook-form';
import { GiTrashCan } from 'react-icons/gi';
import { Colors } from '../../../../../../utilities/enums';
import Button from '../../../../../../components/Button/Button';
import { ControlledInput } from '../../../../../../components/forms/ControllerInput';
import axios, { AxiosResponse } from 'axios';
import { filterOptionsWithData } from '../../../../../../utilities/character-utilities';
import FormSelectAsync from '../../../../../../components/forms/FormSelectAsync';

const styles = require('../field-array-form.module.scss');

const SavingThrowForm = (props: {
  savingThrowIndex: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { savingThrowIndex, control, errors, fieldName, remove } = props;

  const getSavingThrows = (inputValue: string, callback: any) => {
    axios
      .get(`/v1/saving-throws.json?search=${inputValue}`)
      .then((response: AxiosResponse<any>) => {
        const options = filterOptionsWithData(response.data.results);
        callback(options);
      })
      .catch((error) => {
      });
  };

  return (
    <div className={styles.formContainer}>
      <FormSelectAsync
        className={styles.formElementSelect}
        label='Saving Throw'
        name={`${fieldName}.${savingThrowIndex}.nameOption`}
        control={control}
        getOptions={getSavingThrows}
        required
      />
      <ControlledInput
        fieldName={`${fieldName}.${savingThrowIndex}.value`}
        errors={errors}
        className={styles.formElementInput}
        control={control}
        label='Value'
        type='number'
      />
      <Button
        type='button'
        onClick={() => remove(savingThrowIndex)}
        color={Colors.danger}
        icon={<GiTrashCan size={30} />}
        hideTitle
        title='Remove Action'
      />
    </div>
  );
};

export default SavingThrowForm;
