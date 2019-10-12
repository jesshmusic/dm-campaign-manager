/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import Button from 'react-bootstrap/Button';
import { GiTrashCan } from 'react-icons/gi';
import Card from 'react-bootstrap/Card';
import EncounterFields from './EncounterFields';

const EncounterFormCard = ({encounterFieldName, fields, index, npcOptions, push}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
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
        <EncounterFields push={push}
                         npcOptions={npcOptions}
                         encounterFieldName={encounterFieldName}/>
      </Card.Body>
      <Card.Footer>
        <Button onClick={() => removeItem()}
                title={'Remove Encounter'}
                variant={'link'}
                className={'py-0 d-flex align-items-center'}>
          <GiTrashCan size={32}/>
          <span className={'pt-2 pb-1'}>Remove Encounter</span>
        </Button>
      </Card.Footer>
    </Card>
  );
};

EncounterFormCard.propTypes = {
  encounterFieldName: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  npcOptions: PropTypes.array.isRequired,
  push: PropTypes.func.isRequired,
};

export default EncounterFormCard;