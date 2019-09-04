/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CharacterCard from './CharacterCard';

const CharactersList = ({characters}) => (
  characters.map((character) =>
    <CharacterCard character={character} key={character.slug}/>
  )
);

CharactersList.propTypes = {
  characters: PropTypes.array.isRequired
};

export default CharactersList;