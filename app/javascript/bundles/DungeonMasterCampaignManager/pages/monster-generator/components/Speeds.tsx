import React from 'react';
import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import { GiTrashCan } from 'react-icons/gi';
import { speeds } from './GenerateMonster';
// import { FieldArray } from 'react-final-form-arrays';
import { UseFormRegister } from 'react-hook-form';
import {
  FieldValues,
  MonsterGeneratorFormFields,
} from '../../../utilities/types';

const Speeds = (props: {
  push: (speeds1: string, p: {}) => void;
  register: UseFormRegister<FieldValues>;
}) => {
  const name = 'senses[0]';
  return (
    <div className="mb-3">
      <h4>Speeds</h4>
      <div>
        <div className="row">
          <FormSelect
            label={'Speed'}
            name={`${name}.name` as keyof MonsterGeneratorFormFields}
            options={speeds}
          />
          <FormField
            label={'Value'}
            type={'text'}
            register={props.register}
            name={`${name}.value` as keyof MonsterGeneratorFormFields}
          />
          <label>Remove</label>
          <button
            title={'Remove'}
            // onClick={() => fields.remove(index)}
            className="btn btn-link py-0"
          >
            <GiTrashCan size={32} />
          </button>
        </div>
      </div>
      <button
        type="button"
        className="btn btn-lg btn-info"
        onClick={() => true}
      >
        +
      </button>
    </div>
  );
};

export default Speeds;
