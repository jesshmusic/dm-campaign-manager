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
import NPCSelect from '../../npcs/partials/NPCSelect';

const EncounterNPCFields = ({encounterNPC, fields, index}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        numberOfNPCs: fields.value[index].numberOfNPCs,
        monster: fields.value[index].monster,
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
          <FormField label={'Number of NPCs'}
                     type={'number'}
                     colWidth={'12'}
                     name={`${encounterNPC}.numberOfNPCs`}/>
        </Form.Row>
        <NPCSelect name={`${encounterNPC}.monster`}/>
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

EncounterNPCFields.propTypes = {
  encounterNPC: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default EncounterNPCFields;