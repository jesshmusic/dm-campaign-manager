/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';
import {FieldArray} from 'react-final-form-arrays';
import EncounterMonsterFields from './EncounterMonsterFields';
import EncounterItemFields from './EncounterItemFields';
import FormSelect from '../../../components/forms/FormSelect';

const EncounterFields = ({encounterFieldName, npcOptions, push}) => (
  <div>
    <Form.Row>
      <FormField label={'Name'}
                 type={'text'}
                 colWidth={'6'}
                 name={`${encounterFieldName}name`}/>
      <FormField label={'Location'}
                 type={'text'}
                 colWidth={'6'}
                 name={`${encounterFieldName}location`}/>
    </Form.Row>
    <Form.Row>
      <FormRichTextArea
        label={'Description'}
        colWidth={'12'}
        name={`${encounterFieldName}description`}/>
    </Form.Row>
    <h4>Treasure</h4>
    <Form.Row>
      <FormField label={'Copper'} type={'number'} colWidth={'2'} name={`${encounterFieldName}copperPieces`}/>
      <FormField label={'Silver'} type={'number'} colWidth={'2'} name={`${encounterFieldName}silverPieces`}/>
      <FormField label={'Electrum'} type={'number'} colWidth={'2'} name={`${encounterFieldName}electrumPieces`}/>
      <FormField label={'Gold'} type={'number'} colWidth={'2'} name={`${encounterFieldName}goldPieces`}/>
      <FormField label={'Platinum'} type={'number'} colWidth={'2'} name={`${encounterFieldName}platinumPieces`}/>
    </Form.Row>
    <Form.Row>
      <FormSelect label={'Encounter NPCs'}
                  name={`${encounterFieldName}npcs`}
                  colWidth={'12'}
                  options={npcOptions}
                  isClearable
                  isMulti/>
    </Form.Row>
    <Form.Row>
      <Col md={12}>
        <h4>Monsters</h4>
        <FieldArray name={`${encounterFieldName}encounterMonsters`}>
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
        <Button type="button" onClick={() => push(`${encounterFieldName}encounterMonsters`, {
          numberOfMonsters: 1,
        })} variant={'link'} block>Add Monster...</Button>
      </Col>
    </Form.Row>
    <Form.Row>
      <Col md={12}>
        <h4>Items/Treasure/Equipment</h4>
        <FieldArray name={`${encounterFieldName}encounterItems`}>
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
        <Button type="button" onClick={() => push(`${encounterFieldName}encounterItems`, {
          quantity: 1,
        })} variant={'link'} block>Add Item...</Button>
      </Col>
    </Form.Row>
  </div>
);

EncounterFields.propTypes = {
  encounterFieldName: PropTypes.string.isRequired,
  npcOptions: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
};

export default EncounterFields;