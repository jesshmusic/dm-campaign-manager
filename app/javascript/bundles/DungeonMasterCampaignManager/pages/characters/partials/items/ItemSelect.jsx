/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../../components/forms/FormSelectAsync';

export const filterOptions = (results) => results.map((nextItem) => (
  {
    value: nextItem.id,
    label: nextItem.name,
  }
));

const getItems = (inputValue, callback) => {
  fetch(`/v1/items.json?search=${inputValue}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterOptions(jsonResult));
    });
};

const ItemSelect = ({characterItem, colWidth}) => (
  <FormSelectAsync
    label={'Item'}
    colWidth={colWidth}
    getOptions={getItems}
    name={`${characterItem}.item`}
    placeholder={'Search for Equipment...'}
    defaultOptions={[]}
    isClearable
  />
);

ItemSelect.propTypes = {
  characterItem: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
};

export default ItemSelect;