/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import Col from 'react-bootstrap/Col';
import Card from 'react-bootstrap/Card';
import FormTextArea from '../../../components/forms/FormTextArea';
import {FieldArray} from 'react-final-form-arrays';
import EncounterMonsterFields from './EncounterMonsterFields';
import EncounterItemFields from '../../adventures/partials/EncounterItemFields';

const EncounterFields = ({encounter, fields, index, push}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        name: fields.value[index].name,
        description: fields.value[index].description,
        copperPieces: fields.value[index].copperPieces,
        electrumPieces: fields.value[index].electrumPieces,
        silver_pieces: fields.value[index].electrumPieces,
        gold_pieces: fields.value[index].gold_pieces,
        platinum_pieces: fields.value[index].platinum_pieces,
        xp: fields.value[index].xp,
        encounterMonstersAttributes: fields.values[index].encounterMonstersAttributes,
        encounterItemsAttributes: fields.values[index].encounterItemsAttributes,
        _destroy: true,
      });
    } else {
      fields.remove(index);
    }
  };

  return (
    <Card className={'mb-3'}>
      <Card.Header>
        <Card.Title>{fields.value[index].name ? fields.value[index].name : 'New Encounter'}</Card.Title>
      </Card.Header>
      <Card.Body>
        <Form.Row>
          <FormField label={'Name'}
                     type={'text'}
                     colWidth={'12'}
                     name={`${encounter}.name`}/>
        </Form.Row>
        <Form.Row>
          <FormTextArea
            label={'Description'}
            colWidth={'12'}
            name={`${encounter}.description`}/>
        </Form.Row>
        <h4>Treasure</h4>
        <Form.Row>
          <FormField label={'Copper'} type={'number'} colWidth={'2'} name={`${encounter}.copperPieces`}/>
          <FormField label={'Silver'} type={'number'} colWidth={'2'} name={`${encounter}.silverPieces`}/>
          <FormField label={'Electrum'} type={'number'} colWidth={'2'} name={`${encounter}.electrumPieces`}/>
          <FormField label={'Gold'} type={'number'} colWidth={'2'} name={`${encounter}.goldPieces`}/>
          <FormField label={'Platinum'} type={'number'} colWidth={'2'} name={`${encounter}.platinumPieces`}/>
        </Form.Row>
        <Form.Row>
          <Col md={12}>
            <h4>Monsters</h4>
            <FieldArray name={`${encounter}.encounterMonsters`}>
              {({fields}) => (
                fields.map((monster, index) => (
                  !fields.value[index] || !fields.value[index]._destroy ? (
                    <EncounterMonsterFields encounterMonster={monster}
                                            fields={fields}
                                            index={index}
                                            key={index}/>
                  ) : null))
              )}
            </FieldArray>
            <Button type="button" onClick={() => push(`${encounter}.encounterMonsters`, {
              numberOfMonsters: 1,
            })} variant={'link'} block>Add Monster...</Button>
          </Col>
        </Form.Row>
        <Form.Row>
          <Col md={12}>
            <h4>Items/Treasure/Equipment</h4>
            <FieldArray name={`${encounter}.encounterItems`}>
              {({fields}) => (
                fields.map((encounterItem, index) => (
                  !fields.value[index] || !fields.value[index]._destroy ? (
                    <EncounterItemFields encounterItem={encounterItem}
                                         fields={fields}
                                         index={index}
                                         key={index}/>
                  ) : null))
              )}
            </FieldArray>
            <Button type="button" onClick={() => push(`${encounter}.encounterItems`, {
              quantity: 1,
            })} variant={'link'} block>Add Item...</Button>
          </Col>
        </Form.Row>
      </Card.Body>
      <Card.Footer>
        <Form.Row>
          <Form.Group as={Col} md={'12'} className={'my-0'}>
            <Button onClick={() => removeItem()}
                    title={'Remove Encounter'}
                    variant={'link'}
                    className={'py-0 d-flex align-items-center'}>
              <GiTrashCan size={32}/>
              <span className={'pt-2 pb-1'}>Remove Encounter</span>
            </Button>
          </Form.Group>
        </Form.Row>
      </Card.Footer>
    </Card>
  );
};

EncounterFields.propTypes = {
  encounter: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  push: PropTypes.func.isRequired,
};

export default EncounterFields;