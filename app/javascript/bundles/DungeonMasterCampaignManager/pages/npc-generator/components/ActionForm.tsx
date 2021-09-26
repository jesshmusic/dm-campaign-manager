/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import FormField from '../../../components/forms/FormField';
import Row from 'react-bootstrap/Row';
import { FieldArray } from 'react-final-form-arrays';
import FormSelect from '../../../components/forms/FormSelect';
import { diceOptions } from '../GenerateNPC';

const ActionForm = (props: ({
  name: string,
  push: (name: string, object: {}) => void,
  title: string
})) => {
  const { name, push, title } = props;
  return (
    <div className='mb-3'>
      <h4>{title}</h4>
      <FieldArray name={name} className={'mb-3'}>
        {({ fields }) => (
          fields.map((action, index) => (
            !fields.value[index] || !fields.value[index]._destroy ? (
              <Row>
                <Form.Group>
                  <Row>
                    <FormField label={'Name*'}
                               type={'text'}
                               required
                               name={`${action}.label`} />
                    <FormField label={'Description'}
                               type={'text'}
                               name={`${action}.data.desc`} />
                  </Row>
                  <Row>
                    <FieldArray name={`${name}[${index}].damages`} className={'mb-3'}>
                      {({ fields }) => (
                        fields.map((name, index) => (
                          <Row
                            key={`${name}-${index}`}>
                            <Form.Group as={Col}>
                              <Row>
                                <div className='grid'>
                                  <FormField label={''}
                                             type={'number'}
                                             name={`${name}.data.diceCount`} />
                                  <span className='font-large-deco'>d</span>
                                  <FormSelect label={'Dice'}
                                              name={`${name}.data.diceValue`}
                                              options={diceOptions} />
                                </div>
                                <FormField label={'Damage Type'}
                                           type={'text'}
                                           required
                                           name={`${name}.data.damageType`} />
                                <FormField label={'Damage Bonus'}
                                           type={'number'}
                                           name={`${name}.data.damageBonus`} />
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
                            </Form.Group>
                          </Row>
                        ))
                      )}
                    </FieldArray>
                    <Button type='button'
                            onClick={() => {
                              push(`${name}[${index}].damages`, {
                                damageBonus: 0,
                                damageType: 'slashing',
                                diceCount: 1,
                                diceValue: 6
                              });
                            }}
                            variant={'info'}
                            size='lg'>Add Damage</Button>
                  </Row>
                </Form.Group>
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
            ) : null
          ))
        )}
      </FieldArray>
      <Button type='button'
              onClick={() => push(name, {})}
              variant={'info'}
              size='lg'>+</Button>
    </div>
  );
};

export default ActionForm;