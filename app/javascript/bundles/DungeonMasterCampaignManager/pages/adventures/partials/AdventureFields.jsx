/**
 * Created by jesshendricks on 10/12/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormField from '../../../components/forms/FormField';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';
import FormSelect from '../../../components/forms/FormSelect';
import Col from 'react-bootstrap/Col';
import {FieldArray} from 'react-final-form-arrays';
import EncounterFormCard from '../../encounters/partials/EncounterFormCard';
import Button from 'react-bootstrap/Button';

const AdventureFields = ({
  adventureNpcOptions,
  nonPlayerCharacterOptions,
  playerCharacterOptions,
  push,
  worldLocationOptions,
}) => {
  return (
    <div>
      <Form.Row>
        <FormField label={'Adventure name'}
                   type={'text'}
                   colWidth={'12'}
                   name={'name'}/>
      </Form.Row>
      <Form.Row>
        <FormRichTextArea label={'Description'} colWidth={'12'} name={'description'}/>
      </Form.Row>
      <Form.Row>
        <FormSelect
          label={'World Location (required)'}
          name={'worldLocation'}
          colWidth={'12'}
          options={worldLocationOptions}
          isClearable
          isCreateable
        />
      </Form.Row>
      <Form.Row>
        <FormSelect
          label={'Player Characters'}
          name={'playerCharacters'}
          colWidth={'6'}
          options={playerCharacterOptions}
          isClearable
          isMulti
        />
        <FormSelect
          label={'Non-player Characters'}
          name={'nonPlayerCharacters'}
          colWidth={'6'}
          options={nonPlayerCharacterOptions}
          isClearable
          isMulti
        />
      </Form.Row>
      <Form.Row>
        <Col md={12}>
          <h3>Encounters</h3>
          <FieldArray name="encounters">
            {({fields}) => (
              fields.map((encounterFieldName, index) => (
                !fields.value[index] || !fields.value[index]._destroy ? (
                  <EncounterFormCard encounterFieldName={encounterFieldName}
                                     fields={fields}
                                     index={index}
                                     key={index}
                                     npcOptions={adventureNpcOptions}
                                     push={push}/>
                ) : null))
            )}
          </FieldArray>
          <Button type="button" onClick={() => push('encounters', {
            name: '',
            description: '',
            encounterMonsters: [],
            encounterItems: [],
          })} variant={'success'} block>Add Encounter</Button>
        </Col>
      </Form.Row>
    </div>
  );
};

AdventureFields.propTypes = {
  adventureNpcOptions: PropTypes.array.isRequired,
  nonPlayerCharacterOptions: PropTypes.array.isRequired,
  playerCharacterOptions: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
  worldLocationOptions: PropTypes.array.isRequired,
};

export default AdventureFields;