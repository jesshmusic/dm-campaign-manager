/**
 * Created by jesshendricks on 10/13/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import { GiSkullMask, GiSwordAltar } from 'react-icons/gi';
import Button from 'react-bootstrap/Button';

const CharacterStatusButton = ({character, handleReviveCharacter}) => {

  return (
    character.status === 'dead' ? (
      <Button onClick={() => handleReviveCharacter(character)} variant={'link'}>
        <GiSkullMask/>
      </Button>
    ) : (
      <GiSwordAltar/>
    )
  );
};

CharacterStatusButton.propTypes = {
  character: PropTypes.object.isRequired,
  handleReviveCharacter: PropTypes.func.isRequired,
};

export default CharacterStatusButton;