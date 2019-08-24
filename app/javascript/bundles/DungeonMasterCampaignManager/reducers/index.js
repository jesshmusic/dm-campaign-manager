import { combineReducers } from 'redux';
import campaigns from './campaigns';
import flashMessages from './flashMessages';
import items from './items';
import monsters from './monsters';
import nonPlayerCharacters from './nonPlayerCharacters';
import playerCharacters from './playerCharacters';
import spells from './spells';
import users from './user';

export default combineReducers({
  campaigns,
  flashMessages,
  items,
  monsters,
  nonPlayerCharacters,
  playerCharacters,
  spells,
  users,
});