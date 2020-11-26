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

const ItemSelect = ({itemName, colWidth, label}) => (
  <FormSelectAsync
    label={label}
    colWidth={colWidth}
    getOptions={getItems}
    name={`${itemName}.item`}
    placeholder={'Search for Equipment...'}
    defaultOptions={[]}
    isClearable
  />
);

ItemSelect.propTypes = {
  itemName: PropTypes.string.isRequired,
  colWidth: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};

export default ItemSelect;