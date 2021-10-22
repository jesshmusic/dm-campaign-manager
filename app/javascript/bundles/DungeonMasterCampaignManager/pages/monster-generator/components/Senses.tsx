import React from 'react';
import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import { GiSwordsPower, GiTrashCan } from 'react-icons/gi';
import { senses } from './GenerateMonster';
// import { FieldArray } from 'react-final-form-arrays';
import FormContainer from '../../../containers/FormContainer';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import {
  FieldValues,
  MonsterGeneratorFormFields,
} from '../../../utilities/types';
import { Colors } from '../../../utilities/enums';
import { GiArchiveResearch } from 'react-icons/all';
import Button from '../../../components/Button/Button';

const Senses = (props: {
  onChange: (
    name: string,
    value: string | number | boolean,
    config?: {
      shouldDirty?: boolean;
      shouldValidate?: boolean;
      shouldTouch?: boolean;
    }
  ) => void;
  errors: FieldErrors;
  push: (senses1: string, p: {}) => void;
  register: UseFormRegister<FieldValues>;
}) => {
  const { push, register } = props;
  const name = 'TEMP';
  return (
    <div className="mb-3">
      <h4>Senses</h4>
      {/*<FieldArray name='senses' className={'mb-3'}>*/}
      {/*  {({ fields }) => (*/}
      {/*    fields.map((name, index) => (*/}
      <FormContainer columns={8}>
        <FormSelect
          className="g-col-5 mb-0"
          label="Sense"
          name={`${name}.name` as keyof MonsterGeneratorFormFields}
          handleSelectChange={props.onChange}
          options={senses}
        />
        <FormField
          label="Value"
          type="text"
          errors={props.errors}
          onChange={props.onChange}
          register={register}
          className="g-col-2 mb-0"
          name={`${name}.value` as keyof MonsterGeneratorFormFields}
        />
        <div className="g-col-1 d-flex justify-content-center mb-0">
          <Button
            color={Colors.secondary}
            title="Remove"
            icon={<GiTrashCan size={32} />}
          />
        </div>
      </FormContainer>
      {/*    ))*/}
      {/*  )}*/}
      {/*</FieldArray>*/}
      <Button
        color={Colors.info}
        title="Add Sense"
        hideTitle
        onClick={() => push('senses', {})}
        icon={<GiSwordsPower />}
      />
    </div>
  );
};

export default Senses;
