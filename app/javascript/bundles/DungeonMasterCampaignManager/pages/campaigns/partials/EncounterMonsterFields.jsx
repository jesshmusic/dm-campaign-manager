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
import Accordion from 'react-bootstrap/Accordion';
import MonsterSelect from './MonsterSelect';

const EncounterMonsterFields = ({encounterMonster, fields, index}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        numberOfMonsters: fields.value[index].numberOfMonsters,
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
          <FormField label={'Number of Monsters'}
                     type={'number'}
                     colWidth={'12'}
                     name={`${encounterMonster}.numberOfMonsters`}/>
        </Form.Row>
        <MonsterSelect name={`${encounterMonster}.monster`}/>
      </Card.Body>
      <Card.Footer>
        <Form.Row>
          <Form.Group as={Col} md={'12'}>
            <Form.Label>Remove</Form.Label>
            <Button onClick={() => removeItem()}
                    title={'Remove Monster'}
                    variant={'link'}
                    className={'py-0'}>
              <GiTrashCan size={32}/>
            </Button>
          </Form.Group>
        </Form.Row>
      </Card.Footer>
    </Card>
  );
};

EncounterMonsterFields.propTypes = {
  encounterMonster: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
};

export default EncounterMonsterFields;