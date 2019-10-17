/**
 * Created by jesshendricks on 2019-08-25
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormField from '../../../components/forms/FormField';
import Form from 'react-bootstrap/Form';
import { GiTrashCan } from 'react-icons/gi';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import FormSelect from '../../../components/forms/FormSelect';
import FormRichTextArea from '../../../components/forms/FormRichTextArea';

const GuildFields = ({
  guild,
  fields,
  index,
  nonPlayerCharacterOptions,
  playerCharacterOptions,
}) => {
  const removeItem = () => {
    if (fields.value[index] && fields.value[index].id) {
      fields.update(index, {
        id: fields.value[index].id,
        name: fields.value[index].name,
        description: fields.value[index].description,
        _destroy: true,
      });
    } else {
      fields.remove(index);
    }
  };

  return (
    <div>
      <Form.Row>
        <FormField label={'Name'}
                   type={'text'}
                   colWidth={'3'}
                   name={`${guild}.name`}/>
      </Form.Row>
      <Form.Row>
        <FormRichTextArea label={'Description'}
                          colWidth={'12'}
                          name={`${guild}.description`}/>
      </Form.Row>
      <Form.Row>
        {playerCharacterOptions ? (
          <FormSelect
            label={'Player Characters'}
            name={'playerCharacters'}
            colWidth={'6'}
            options={playerCharacterOptions}
            isClearable
            isMulti
          />
        ) : null}
        {nonPlayerCharacterOptions ? (
          <FormSelect
            label={'Non-player Characters'}
            name={'nonPlayerCharacters'}
            colWidth={'6'}
            options={nonPlayerCharacterOptions}
            isClearable
            isMulti
          />
        ) : null}
      </Form.Row>
      <Form.Row>
        <Form.Group as={Col} md={'1'}>
          <Form.Label>Remove</Form.Label>
          <Button onClick={() => removeItem()}
                  title={'Remove Guild'}
                  variant={'link'}
                  className={'py-0'}>
            <GiTrashCan size={32}/>
          </Button>
        </Form.Group>
      </Form.Row>
    </div>
  );
}

GuildFields.propTypes = {
  guild: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  fields: PropTypes.object.isRequired,
  nonPlayerCharacterOptions: PropTypes.array,
  playerCharacterOptions: PropTypes.array,
};

export default GuildFields;