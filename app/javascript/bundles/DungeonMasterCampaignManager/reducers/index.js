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
import adventures from './adventures';
import encounters from './encounters';

export default combineReducers({
  adventures,
  campaigns,
  dndClasses,
  encounters,
  flashMessages,
  items,
  monsters,
  nonPlayerCharacters,
  playerCharacters,
  races,
  spells,
  users,
});