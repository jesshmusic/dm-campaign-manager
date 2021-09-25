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
  colWidth: string,
  name: string,
  push: (name: string, object: {}) => void,
  title: string
})) => {
  const { colWidth, name, push, title } = props;
  return (
    <div>
      <h3>{title}</h3>
      <FieldArray name={name} className={'mb-3'}>
        {({ fields }) => (
          fields.map((action, index) => (
            !fields.value[index] || !fields.value[index]._destroy ? (
              <Row>
                <Form.Group as={Col} md={colWidth}>
                  <Row>
                    <FormField label={'Name*'}
                               type={'text'}
                               colWidth={'12'}
                               name={`${action}.label`} />
                    <FormField label={'Description'}
                               type={'text'}
                               colWidth={'12'}
                               name={`${action}.data.desc`} />
                  </Row>
                  <Row>
                    <FieldArray name={`${name}[${index}].damages`} className={'mb-3'}>
                      {({ fields }) => (
                        fields.map((name, index) => (
                          <Row>
                            <Form.Group as={Col}>
                              <Row>
                                <FormField label={''}
                                           type={'number'}
                                           colWidth={'2'}
                                           name={`${name}.data.diceCount`} />
                                <Col md={1}>d</Col>
                                <FormSelect colWidth={'2'}
                                            label={'Dice'}
                                            name={`${name}.data.diceValue`}
                                            options={diceOptions} />
                                <FormField label={'Damage Type'}
                                           type={'text'}
                                           colWidth={'3'}
                                           name={`${name}.data.damageType`} />
                                <FormField label={'Damage Bonus'}
                                           type={'number'}
                                           colWidth={'3'}
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