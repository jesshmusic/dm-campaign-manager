/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CharacterCard from './CharacterCard';

const CharactersList = ({characters, small}) => (
  characters.map((character) =>
    <CharacterCard character={character} key={character.slug} small={small}/>
  )
);

CharactersList.propTypes = {
  characters: PropTypes.array.isRequired,
  small: PropTypes.bool,
};

export default CharactersList;