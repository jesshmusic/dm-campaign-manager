import { combineReducers } from 'redux';
import dndClasses from './dndClasses';
import flashMessages from './flashMessages';
import items from './items';
import npcs from './npcs';
import races from './races';
import spells from './spells';
import users from './user';

export default combineReducers({
  dndClasses,
  flashMessages,
  items,
  npcs,
  races,
  spells,
  users,
});