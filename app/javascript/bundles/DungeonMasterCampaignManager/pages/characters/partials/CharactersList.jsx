/**
 * Created by jesshendricks on 9/3/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import CharacterCard from './CharacterCard';

const CharactersList = ({campaign, characters, onReviveCharacter, small}) => (
  characters.map((character) =>
    <CharacterCard campaign={campaign}
                   character={character}
                   key={character.slug}
                   small={small}
                   onReviveCharacter={onReviveCharacter}/>
  )
);

CharactersList.propTypes = {
  campaign: PropTypes.object.isRequired,
  characters: PropTypes.array.isRequired,
  onReviveCharacter: PropTypes.func.isRequired,
  small: PropTypes.bool,
};

export default CharactersList;