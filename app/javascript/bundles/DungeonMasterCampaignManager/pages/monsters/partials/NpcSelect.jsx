/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

const filterMonsterOptions = (results) => results.results.map((nextItem) => ({
    value: nextItem.id,
    label: `${ nextItem.name }: CR ${ nextItem.challengeRating } - ${ nextItem.xp }xp`,
    challengeRating: nextItem.challengeRating,
    xp: nextItem.xp,
    armorClass: nextItem.armorClass,
    hitPoints: nextItem.hitPoints
  }
));

const getMonsters = (challengeRating, inputValue, callback) => {
  const challengeRatingParam = challengeRating ? `&challenge_rating=${ challengeRating }` : '';
  fetch(`/v1/monsters.json?search=${ inputValue }${ challengeRatingParam }`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterMonsterOptions(jsonResult));
    });
};

const MonsterSelect = ({ challengeRating, name }) => (
  <Row>
    <FormSelectAsync
      label={ 'Monster' }
      colWidth={ '12' }
      getOptions={ (inputValue, callback) => getMonsters(challengeRating, inputValue, callback) }
      name={ name }
      defaultOptions={ [] }
      isClearable
      placeholder={ 'Search for Monsters...' } />
  </Row>
);

MonsterSelect.propTypes = {
  challengeRating: PropTypes.string,
  name: PropTypes.string.isRequired
};

export default MonsterSelect;