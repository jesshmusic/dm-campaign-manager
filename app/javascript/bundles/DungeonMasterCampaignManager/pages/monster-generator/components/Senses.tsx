import React from 'react';
import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import { GiTrashCan } from 'react-icons/gi';
import { senses } from './GenerateMonster';
// import { FieldArray } from 'react-final-form-arrays';
import FormContainer from '../../../containers/FormContainer';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues, MonsterGeneratorFormFields } from '../../../utilities/types';

const Senses = (props: { push: (senses1: string, p: {}) => void, register: UseFormRegister<FieldValues> }) => {
  const { push, register } = props;
  const name = 'TEMP';
  return (
    <div className='mb-3'>
      <h4>Senses</h4>
      {/*<FieldArray name='senses' className={'mb-3'}>*/}
      {/*  {({ fields }) => (*/}
      {/*    fields.map((name, index) => (*/}
      <FormContainer columns={8}>
        <FormSelect className='g-col-5 mb-0'
                    label='Sense'
                    name={`${name}.name` as keyof MonsterGeneratorFormFields}
                    options={senses} />
        <FormField label='Value'
                   type='text'
                   register={register}
                   className='g-col-2 mb-0'
                   name={`${name}.value` as keyof MonsterGeneratorFormFields} />
        <div className='g-col-1 d-flex justify-content-center mb-0'>
          <button title='Remove'
            // onClick={() => fields.remove(index)}
                  className='py-0 btn btn-link'>
            <GiTrashCan size={32} />
          </button>
        </div>
      </FormContainer>
      {/*    ))*/}
      {/*  )}*/}
      {/*</FieldArray>*/}
      <button type='button'
              onClick={() => push('senses', {})}
              className={'btn btn-lg btn-info'}>
        +
      </button>
    </div>
  );
};

export default Senses;