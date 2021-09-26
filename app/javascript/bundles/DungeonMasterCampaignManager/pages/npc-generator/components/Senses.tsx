import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import React from 'react';
import { senses } from '../GenerateNPC';
import { FieldArray } from 'react-final-form-arrays';

const Senses = (props: { push: (senses1: string, p: {}) => void; }) => {
  return (
    <div className='mb-3'>
      <h4>Senses</h4>
      <FieldArray name='senses' className={'mb-3'}>
        {({ fields }) => (
          fields.map((name, index) => (
            <div className='grid mb-2 p-2 pb-3 bg-warning'
                 style={{ '--bs-columns': 8 } as React.CSSProperties}>
              <FormSelect className='g-col-5 mb-0'
                          label={'Sense'}
                          name={`${name}.name`}
                          options={senses} />
              <FormField label={'Value'}
                         type={'text'}
                         className='g-col-2 mb-0'
                         name={`${name}.value`} />
              <div className='g-col-1 d-flex justify-content-center mb-0'>
                <Button onClick={() => fields.remove(index)}
                        title={'Remove'}
                        variant={'link'}
                        className={'py-0'}>
                  <GiTrashCan size={32} />
                </Button>
              </div>
            </div>
          ))
        )}
      </FieldArray>
      <Button type='button'
              onClick={() => props.push('senses', {})}
              variant={'info'}
              size='lg'>+</Button>
    </div>
  );
};

export default Senses;