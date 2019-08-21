import { combineReducers } from 'redux';
import campaigns from './campaigns';
import dungeonMasters from './dungeonMasters';
import flashMessages from './flashMessages';
import items from './items';
import nonPlayerCharacters from './nonPlayerCharacters';
import playerCharacters from './playerCharacters';
import user from './user';

export default combineReducers({
  campaigns,
  dungeonMasters,
  flashMessages,
  items,
  nonPlayerCharacters,
  playerCharacters,
  user,
});