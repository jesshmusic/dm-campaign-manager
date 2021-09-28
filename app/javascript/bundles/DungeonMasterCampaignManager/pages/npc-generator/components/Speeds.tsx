import Row from 'react-bootstrap/Row';
import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import React from 'react';
import { speeds } from './GenerateNPC';
// import { FieldArray } from 'react-final-form-arrays';
import { UseFormRegister } from 'react-hook-form';
import { FieldValues } from '../../../utilities/types';

const Speeds = (props: { push: (speeds1: string, p: {}) => void, register: UseFormRegister<FieldValues> }) => {
  const name = 'TEMP';
  return (
    <div className='mb-3'>
      <h4>Speeds</h4>
      <div>
        <Row>
          <FormSelect label={'Speed'}
                      name={`${name}.name`}
                      options={speeds} />
          <FormField label={'Value'}
                     type={'text'}
                     register={props.register}
                     name={`${name}.value`} />
          <Form.Group as={Col} md={'1'}>
            <Form.Label>Remove</Form.Label>
            <Button title={'Remove'}
              // onClick={() => fields.remove(index)}
                    variant={'link'}
                    className={'py-0'}>
              <GiTrashCan size={32} />
            </Button>
          </Form.Group>
        </Row>
      </div>
      <Button type='button'
              onClick={() => true}
              variant={'info'}
              size='lg'>+</Button>
    </div>
  );
};

export default Speeds;