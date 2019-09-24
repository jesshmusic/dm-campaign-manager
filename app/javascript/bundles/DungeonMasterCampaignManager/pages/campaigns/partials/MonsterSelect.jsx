/**
 * Created by jesshendricks on 9/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import FormSelectAsync from '../../../components/forms/FormSelectAsync';
import Form from 'react-bootstrap/Form';

const filterMonsterOptions = (results) => results.map((nextItem) => ({
  value: nextItem.id,
  label: nextItem.name,
  challengeRating: nextItem.challengeRating,
  xp: nextItem.xp,
  armorClass: nextItem.armorClass,
  hitPoints: nextItem.hitPoints,
}));

const getMonsters = (challengeRating, inputValue, callback) => {
  const challengeRatingParam = challengeRating ? `&challenge_rating=${challengeRating}` : '';
  fetch(`/v1/monsters.json?search=${inputValue}${challengeRatingParam}`)
    .then((response) => response.json())
    .then((jsonResult) => {
      callback(filterMonsterOptions(jsonResult));
    });
};

const MonsterSelect = ({challengeRating}) => (
  <Form.Row>
    <FormSelectAsync
      label={'Monster'}
      colWidth={'12'}
      getOptions={(inputValue, callback) => getMonsters(challengeRating, inputValue, callback)}
      name={'monster'}
      defaultOptions={[]}
      isClearable
      placeholder={'Search for Monsters...'} />
  </Form.Row>
);

MonsterSelect.propTypes = {
  challengeRating: PropTypes.string,
};

export default MonsterSelect;