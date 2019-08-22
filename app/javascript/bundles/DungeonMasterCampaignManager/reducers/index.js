import { combineReducers } from 'redux';
import campaigns from './campaigns';
import flashMessages from './flashMessages';
import items from './items';
import nonPlayerCharacters from './nonPlayerCharacters';
import playerCharacters from './playerCharacters';
import users from './user';

export default combineReducers({
  campaigns,
  flashMessages,
  items,
  nonPlayerCharacters,
  playerCharacters,
  users,
});