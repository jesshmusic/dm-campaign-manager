import React from 'react';
import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import { GiTrashCan } from 'react-icons/gi';
import { senses } from './GenerateNPC';
import { FieldArray } from 'react-final-form-arrays';
import FormContainer from '../../../containers/FormContainer';

const Senses = (props: { push: (senses1: string, p: {}) => void, columns?: number }) => {
  const { push, columns } = props;
  return (
    <div className='mb-3'>
      <h4>Senses</h4>
      <FieldArray name='senses' className={'mb-3'}>
        {({ fields }) => (
          fields.map((name, index) => (
            <FormContainer columns={8} key={index}>
              <FormSelect className='g-col-5 mb-0'
                          label='Sense'
                          name={`${name}.name`}
                          options={senses} />
              <FormField label='Value'
                         type='text'
                         className='g-col-2 mb-0'
                         name={`${name}.value`} />
              <div className='g-col-1 d-flex justify-content-center mb-0'>
                <button onClick={() => fields.remove(index)}
                        title='Remove'
                        className='py-0 btn btn-link'>
                  <GiTrashCan size={32} />
                </button>
              </div>
            </FormContainer>
          ))
        )}
      </FieldArray>
      <button type='button'
              onClick={() => push('senses', {})}
              className={'btn btn-lg btn-info'}>
        +
      </button>
    </div>
  );
};

export default Senses;