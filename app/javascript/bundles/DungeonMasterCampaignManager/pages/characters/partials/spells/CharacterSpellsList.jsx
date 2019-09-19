/**
 * Created by jesshendricks on 9/19/19
 */

import React from 'react';
import PropTypes from 'prop-types';
import Accordion from 'react-bootstrap/Accordion';
import CharacterSpellLevel from './CharacterSpellLevel';

const CharacterSpellsList = ({charClass}) => {
  return (<Accordion>
    {charClass.spellsCantrips && charClass.spellsCantrips.length > 0 ? (
      <CharacterSpellLevel levelNumber={0} spells={charClass.spellsCantrips}/>
    ) : null}
    {charClass.spellsLevel1 && charClass.spellsLevel1.length > 0 ? (
      <CharacterSpellLevel levelNumber={1} spells={charClass.spellsLevel1}/>
    ) : null}
    {charClass.spellsLevel2 && charClass.spellsLevel2.length > 0 ? (
      <CharacterSpellLevel levelNumber={2} spells={charClass.spellsLevel2}/>
    ) : null}
    {charClass.spellsLevel3 && charClass.spellsLevel3.length > 0 ? (
      <CharacterSpellLevel levelNumber={3} spells={charClass.spellsLevel3}/>
    ) : null}
    {charClass.spellsLevel4 && charClass.spellsLevel4.length > 0 ? (
      <CharacterSpellLevel levelNumber={4} spells={charClass.spellsLevel4}/>
    ) : null}
    {charClass.spellsLevel5 && charClass.spellsLevel5.length > 0 ? (
      <CharacterSpellLevel levelNumber={5} spells={charClass.spellsLevel5}/>
    ) : null}
    {charClass.spellsLevel6 && charClass.spellsLevel6.length > 0 ? (
      <CharacterSpellLevel levelNumber={6} spells={charClass.spellsLevel6}/>
    ) : null}
    {charClass.spellsLevel7 && charClass.spellsLevel7.length > 0 ? (
      <CharacterSpellLevel levelNumber={7} spells={charClass.spellsLevel7}/>
    ) : null}
    {charClass.spellsLevel8 && charClass.spellsLevel8.length > 0 ? (
      <CharacterSpellLevel levelNumber={8} spells={charClass.spellsLevel8}/>
    ) : null}
    {charClass.spellsLevel9 && charClass.spellsLevel9.length > 0 ? (
      <CharacterSpellLevel levelNumber={9} spells={charClass.spellsLevel9}/>
    ) : null}
  </Accordion>);
};

CharacterSpellsList.propTypes = {
  charClass: PropTypes.object.isRequired,
};

export default CharacterSpellsList;