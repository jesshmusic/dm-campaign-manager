/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormSelect from '../../../components/forms/FormSelect';

const NpcSelect = ({npcOptions, name}) => (
  <Form.Row>
    <FormSelect
      label={'NPC'}
      colWidth={'12'}
      name={name}
      options={npcOptions}
      isClearable />
  </Form.Row>
);

NpcSelect.propTypes = {
  name: PropTypes.string.isRequired,
  npcOptions: PropTypes.array.isRequired,
};

export default NpcSelect;