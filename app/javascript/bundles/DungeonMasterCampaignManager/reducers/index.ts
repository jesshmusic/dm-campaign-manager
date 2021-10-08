import { combineReducers } from 'redux';
import dndClasses from './dndClasses';
import flashMessages from './flashMessages';
import items from './items';
import monsters from './monsters';
import races from './races';
import sections from './sections';
import spells from './spells';
import users from './user';

export default combineReducers({
  dndClasses,
  flashMessages,
  items,
  monsters,
  races,
  sections,
  spells,
  users,
});
