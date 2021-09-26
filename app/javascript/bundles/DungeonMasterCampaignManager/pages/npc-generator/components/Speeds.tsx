import Row from 'react-bootstrap/Row';
import FormSelect from '../../../components/forms/FormSelect';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import React from 'react';
import { speeds } from '../GenerateNPC';
import { FieldArray } from 'react-final-form-arrays';

const Speeds = (props: { push: (speeds1: string, p: {}) => void; }) => {
  return (
    <div className='mb-3'>
      <h4>Speeds</h4>
      <FieldArray name='speeds' className={'mb-3'}>
        {({ fields }) => (
          fields.map((name, index) => (
            <div
              key={`${name}-${index}`}>
              <Row>
                <FormSelect label={'Speed'}
                            name={`${name}.name`}
                            options={speeds} />
                <FormField label={'Value'}
                           type={'text'}
                           name={`${name}.value`} />
                <Form.Group as={Col} md={'1'}>
                  <Form.Label>Remove</Form.Label>
                  <Button onClick={() => fields.remove(index)}
                          title={'Remove'}
                          variant={'link'}
                          className={'py-0'}>
                    <GiTrashCan size={32} />
                  </Button>
                </Form.Group>
              </Row>
            </div>
          ))
        )}
      </FieldArray>
      <Button type='button'
              onClick={() => props.push('speeds', {})}
              variant={'info'}
              size='lg'>+</Button>
    </div>
  );
};

export default Speeds;