import { combineReducers } from 'redux';
import campaigns from './campaigns';
import dndClasses from './dndClasses';
import flashMessages from './flashMessages';
import items from './items';
import monsters from './monsters';
import nonPlayerCharacters from './nonPlayerCharacters';
import playerCharacters from './playerCharacters';
import races from './races';
import spells from './spells';
import users from './user';

export default combineReducers({
  campaigns,
  dndClasses,
  flashMessages,
  items,
  monsters,
  nonPlayerCharacters,
  playerCharacters,
  races,
  spells,
  users,
});