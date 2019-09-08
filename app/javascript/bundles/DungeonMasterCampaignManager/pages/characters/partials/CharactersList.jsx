/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CharacterCard from './CharacterCard';

const CharactersList = ({campaign, characters, small}) => (
  characters.map((character) =>
    <CharacterCard campaign={campaign} character={character} key={character.slug} small={small}/>
  )
);

CharactersList.propTypes = {
  campaign: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
  small: PropTypes.bool,
};

export default CharactersList;