/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelect from '../../../components/forms/FormSelect';
import {npcVariantOptions} from '../../../utilities/character-utilities';

const NpcVariationSelect = ({colWidth}) => (
  <FormSelect
    label={'Variant'}
    colWidth={colWidth}
    options={npcVariantOptions}
    name={'npcVariant'} />
);

NpcVariationSelect.propTypes = {
  colWidth: PropTypes.string.isRequired,
};

export default NpcVariationSelect;