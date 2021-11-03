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

const SkillForm = (props: {
  skillIndex: number;
  control: Control;
  errors: FieldErrors;
  fieldName: string;
  remove: (index?: number | number[] | undefined) => void;
}) => {
  const { skillIndex, control, errors, fieldName, remove } = props;

  const getSkills = (inputValue: string, callback: any) => {
    axios
      .get(`/v1/prof-skills.json?search=${inputValue}`)
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
        label='Skill'
        name={`${fieldName}.${skillIndex}.nameOption`}
        control={control}
        getOptions={getSkills}
        required
      />
      <ControlledInput
        fieldName={`${fieldName}.${skillIndex}.value`}
        errors={errors}
        className={styles.formElementInput}
        control={control}
        label='Value'
        type='number'
      />
      <Button
        type='button'
        onClick={() => remove(skillIndex)}
        color={Colors.danger}
        icon={<GiTrashCan size={30} />}
        hideTitle
        title='Remove Action'
      />
    </div>
  );
};

export default SkillForm;
