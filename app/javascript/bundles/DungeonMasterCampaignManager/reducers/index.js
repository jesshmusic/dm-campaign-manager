import { combineReducers } from 'redux';
import campaigns from './campaigns';
import dungeonMasters from './dungeonMasters';
import flashMessages from './flashMessages';
import nonPlayerCharacters from './nonPlayerCharacters';
import playerCharacters from './playerCharacters';
import user from './user';

const preloadedState = {
  user: null,
  campaigns: [],
  nonPlayerCharacters: null,
  playerCharacters: null,
  dungeonMasters: [],
  flashMessages: [],
};

export default combineReducers({
  campaigns,
  dungeonMasters,
  flashMessages,
  nonPlayerCharacters,
  playerCharacters,
  user,
});