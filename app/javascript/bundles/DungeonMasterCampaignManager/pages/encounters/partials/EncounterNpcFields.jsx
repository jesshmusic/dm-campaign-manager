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
import NpcSelect from '../../characters/partials/NpcSelect';

const EncounterNpcFields = ({encounterNpc, fields, index, npcOptions}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        isCombatant: fields.value[index].isCombatant,
        npc: fields.value[index].npc,
        _destroy: true,
      });
    } else {
      fields.remove(index);
    }
  };

  return (
    <Card className={'mb-3'}>
      <Card.Body>
        <Form.Row>
          <FormField label={'Is Combatant?'}
                     type={'checkbox'}
                     colWidth={'12'}
                     name={`${encounterNpc}.isCombatant`}/>
        </Form.Row>
        <NpcSelect name={`${encounterNpc}.npc`} npcOptions={npcOptions}/>
      </Card.Body>
      <Card.Footer>
        <Form.Row>
          <Form.Group as={Col} md={'12'} className={'my-0'}>
            <Button onClick={() => removeItem()}
                    title={'Remove NPC'}
                    variant={'link'}
                    className={'py-0 d-flex align-items-center'}>
              <GiTrashCan size={24}/>
              <span className={'pt-2 pb-1'}>Remove NPC</span>
            </Button>
          </Form.Group>
        </Form.Row>
      </Card.Footer>
    </Card>
  );
};

EncounterNpcFields.propTypes = {
  encounterNpc: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  npcOptions: PropTypes.array.isRequired,
};

export default EncounterNpcFields;