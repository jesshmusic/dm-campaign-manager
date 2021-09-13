/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Form from 'react-bootstrap/Form';
import FormSelect from '../../../components/forms/FormSelect';
import Row from 'react-bootstrap/Row';

const NpcSelect = ({npcOptions, name}) => (
  <Row>
    <FormSelect
      label={ 'NPC' }
      colWidth={ '12' }
      name={ name }
      options={ npcOptions }
      isClearable/>
  </Row>
);

NpcSelect.propTypes = {
  name: PropTypes.string.isRequired,
  npcOptions: PropTypes.array.isRequired,
};

export default NpcSelect;