/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const filterNPCOptions = (results) => results.results.map((nextItem) => ({
  value: nextItem.id,
  label: `${ nextItem.name }: CR ${ nextItem.challengeRating } - ${ nextItem.xp }xp`,
  challengeRating: nextItem.challengeRating,
  xp: nextItem.xp,
  armorClass: nextItem.armorClass,
  hitPoints: nextItem.hitPoints,
}
));

const getNPCs = (challengeRating, inputValue, callback) => {
  const challengeRatingParam = challengeRating ? `&challenge_rating=${ challengeRating }` : '';
  fetch(`/v1/monsters.json?search=${ inputValue }${ challengeRatingParam }`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterNPCOptions(jsonResult));
    });
};

const NPCSelect = ({challengeRating, name}) => (
  <Row>
    <FormSelectAsync
      label={ 'NPC' }
      colWidth={ '12' }
      getOptions={ (inputValue, callback) => getNPCs(challengeRating, inputValue, callback) }
      name={ name }
      defaultOptions={ [] }
      isClearable
      placeholder={ 'Search for Monsters...' }/>
  </Row>
);

NPCSelect.propTypes = {
  challengeRating: PropTypes.string,
  name: PropTypes.string.isRequired,
};

export default NPCSelect;